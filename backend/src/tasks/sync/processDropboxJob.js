const axios = require('axios')
const crypto = require('crypto')
const pMap = require('p-map')
const log = require('loglevel')

const constants = require('../../constants')
const { sleep } = require('../../utils')
const config = require('../../../config/')

const DROPBOX_API_URL = 'https://api.dropboxapi.com/2'
const DROPBOX_DOWNLOAD_URL = 'https://content.dropboxapi.com/2/files/download'
const LIST_FOLDER_URL = `${DROPBOX_API_URL}/files/list_folder`
const CONTINUE_LIST_URL = `${DROPBOX_API_URL}/files/list_folder/continue`

// backoff for errors
const MAX_RETRIES = 3
const INITIAL_DELAY = 5000

const hashFile = input => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    input
      .on('error', reject)
      .pipe(hash)
      .once('finish', () => {
        resolve(hash.read())
      })
  })
}

const runAndHandleErrors = async f => {
  let retries = MAX_RETRIES
  while (retries > 0) {
    try {
      const result = await f()
      return result
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const authError = new Error()
        authError.type = constants.errorType.AUTH
        throw authError
      }
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.statusText.includes('path/restricted_content')
      ) {
        return null
      }
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after']
        await sleep(retryAfter * 1000)
        log.info('Rate Limited', error.response.headers['retry-after'])
      }

      retries -= 1
      if (retries < 1) {
        throw error
      }

      await sleep(INITIAL_DELAY * 2 ** (MAX_RETRIES - retries))
    }
  }

  // should never reach - satisfy linter
  return null
}

const getInitialList = async token => {
  const data = {
    path: '',
    recursive: true,
  }
  const listResponse = await runAndHandleErrors(async () =>
    axios.post(LIST_FOLDER_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  )
  return listResponse.data
}

const getList = async (cursor, token) => {
  const data = {
    cursor,
  }
  const listResponse = await runAndHandleErrors(async () =>
    axios.post(CONTINUE_LIST_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  )
  return listResponse.data
}

const getFileHash = async (fileId, token) => {
  const args = {
    path: fileId,
  }
  const hash = await runAndHandleErrors(async () => {
    const downloadResponse = await axios.request({
      url: DROPBOX_DOWNLOAD_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Dropbox-API-Arg': JSON.stringify(args),
      },
      responseType: 'stream',
    })
    return hashFile(downloadResponse.data)
  })
  return hash
}

const getFile = async (file, token) => {
  const hash = await getFileHash(file.id, token)
  if (hash) {
    const hashedFile = {
      hash,
      title: file.name,
      fileType: 'file',
    }
    return hashedFile
  }
  return null
}

const processDropboxJob = async (initalCursor, token) => {
  let cursor = initalCursor
  let hasMore = true

  const responseData = cursor
    ? await getList(cursor, token)
    : await getInitialList(token)

  const {
    entries,
    has_more: responseHasMore,
    cursor: responseCursor,
  } = responseData
  hasMore = responseHasMore
  cursor = responseCursor

  const files = entries.filter(entry => entry['.tag'] === 'file')

  const hashedFiles = await pMap(files, file => getFile(file, token), {
    concurrency: config.syncFileConcurrency,
  })

  return {
    // filter nulls if 501 error restricted content
    hashedFiles: hashedFiles.filter(Boolean),
    hasMore,
    cursor,
  }
}

module.exports = processDropboxJob
