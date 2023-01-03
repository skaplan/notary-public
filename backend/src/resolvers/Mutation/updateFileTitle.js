const crypto = require('crypto')

const config = require('../../../config/')
const { docClient } = require('../../../config/aws')
const getFile = require('../../utils/getFile')

const getItem = async key => {
  const params = {
    TableName: config.dynamoTable,
    Key: {
      key,
    },
  }
  const { Item } = await docClient.get(params).promise()
  return Item
}

const putItem = async item => {
  const params = {
    TableName: config.dynamoTable,
    Item: item,
  }
  return docClient.put(params).promise()
}

const updateFileTitleResolver = async (obj, { input }, { user }) => {
  const { title, hash } = input

  if (!user) throw new Error('Must be logged in')

  const userIdHash = crypto
    .createHash('sha256')
    .update(user.id)
    .digest()

  const key = crypto
    .createHash('sha256')
    .update(Buffer.concat([userIdHash, Buffer.from(hash, 'hex')]))
    .digest()

  const node = await getItem(key.toString('hex'))

  if (!node) return { error: 'File not found' }

  await putItem({ ...node, title })

  return { file: getFile(user.id, hash) }
}

module.exports = {
  Mutation: {
    updateFileTitle: updateFileTitleResolver,
  },
}
