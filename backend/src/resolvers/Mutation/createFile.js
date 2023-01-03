const { transaction } = require('objection')
const moment = require('moment')

const saveHashedFiles = require('../../utils/saveHashedFiles')
const getFile = require('../../utils/getFile')
const StarredFile = require('../../models/StarredFile')

const knex = StarredFile.knex()

const createFileResolver = async (obj, { input }, { user }) => {
  const { title, hash } = input

  const hashIsValid = /[A-Fa-f0-9]{64}/.test(hash)
  if (!hashIsValid) return { error: 'Invalid hash' }

  const userId = user ? user.id : ''

  const existingFile = await getFile(userId, hash)
  if (existingFile) return { file: existingFile }

  const result = await transaction(knex, async trx => {
    // could be improved to check for a file period
    const hashedFile = {
      title,
      hash: Buffer.from(hash, 'hex'),
      fileType: 'file',
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
          fileType: 'file',
          fileAddedAt: moment(),
        })
      }
    }

    return { file: getFile(userId, hash) }
  })
  return result
}

module.exports = {
  Mutation: {
    createFile: createFileResolver,
  },
}
