const { transaction } = require('objection')
const moment = require('moment')
const crypto = require('crypto')

const saveHashedFiles = require('../../utils/saveHashedFiles')
const getFile = require('../../utils/getFile')
const StarredFile = require('../../models/StarredFile')

const knex = StarredFile.knex()

const createNoteResolver = async (obj, { input }, { user }) => {
  const untitledTitle = `Untitled File ${moment().format(
    'MMMM Do YYYY, h:mm:ss a',
  )}`

  const { title = untitledTitle, body } = input

  const hash = crypto
    .createHash('sha256')
    .update(body)
    .digest()
    .toString('hex')
  const userId = user ? user.id : ''

  const existingFile = await getFile(userId, hash)
  if (existingFile) return { note: existingFile }

  const result = await transaction(knex, async trx => {
    const hashedFile = {
      fileType: 'note',
      title,
      body,
      hash: Buffer.from(hash, 'hex'),
    }

    await saveHashedFiles(trx, [hashedFile], userId, null)
    if (user) {
      const existingStarredFile = await StarredFile.query(trx)
        .where({
          userId: user.id,
          hash,
        })
        .first()

      if (!existingStarredFile) {
        await StarredFile.query(trx).insert({
          hash,
          userId: user.id,
          title,
          body,
          fileType: 'note',
          fileAddedAt: moment(),
        })
      }
    }

    return { note: getFile(userId, hash) }
  })
  return result
}

module.exports = {
  Mutation: {
    createNote: createNoteResolver,
  },
}
