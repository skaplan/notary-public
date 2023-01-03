const crypto = require('crypto')
const moment = require('moment')

const Notification = require('../../models/Notification')
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

const createNotificationResolver = async (obj, { input }, { user }) => {
  const { hash, email: inputEmail } = input

  if (!user && !inputEmail) throw new Error('Must provide an email.')

  const userId = user ? user.id : ''

  const userIdHash = crypto
    .createHash('sha256')
    .update(userId)
    .digest()

  const key = crypto
    .createHash('sha256')
    .update(Buffer.concat([userIdHash, Buffer.from(hash, 'hex')]))
    .digest()
    .toString('hex')

  const node = await getItem(key)

  if (!node) throw new Error('Hash not found')

  const email = user ? user.email : inputEmail

  await Notification.query().insert({
    status: 'pending',
    email,
    hash,
    checkAfter: moment(),
    userId: user ? user.id : null,
  })

  return getFile(userId, hash)
}

module.exports = {
  Mutation: {
    createNotification: createNotificationResolver,
  },
}
