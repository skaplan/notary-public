const crypto = require('crypto')
const moment = require('moment')

const config = require('../../../config/')
const { docClient } = require('../../../config/aws')

const StarredFile = require('../../models/StarredFile')

const getKey = async key => {
  if (!key) return null

  const getParams = {
    TableName: config.dynamoTable,
    Key: {
      key,
    },
  }

  const response = await docClient.get(getParams).promise()
  return response.Item
}

const createStarredFileResolver = async (obj, args, { user }) => {
  const { hash } = args

  if (!user) throw new Error('Must be logged in.')

  const existingStarredFile = await user
    .$relatedQuery('starredFiles')
    .where({ hash })
    .first()

  if (existingStarredFile) return existingStarredFile

  const userIdHash = crypto
    .createHash('sha256')
    .update(user.id)
    .digest()

  const key = crypto
    .createHash('sha256')
    .update(Buffer.concat([userIdHash, Buffer.from(hash, 'hex')]))
    .digest()
    .toString('hex')

  const Item = await getKey(key)

  if (!Item) {
    throw new Error('Invalid hash')
  }

  const { type, fileType, title, addedAt } = Item

  if (type !== 'leaf') throw new Error('Invalid hash')

  const starredFile = await StarredFile.query().insert({
    hash,
    userId: user.id,
    title,
    fileAddedAt: moment(addedAt),
    fileType,
  })

  return starredFile
}

module.exports = {
  Mutation: {
    createStarredFile: createStarredFileResolver,
  },
}
