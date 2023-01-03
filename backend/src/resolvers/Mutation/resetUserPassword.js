const moment = require('moment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../../config/')

const PasswordReset = require('../../models/PasswordReset')

const EXPIRATION_TIME = moment.duration(1, 'days')

const resetUserPasswordResolver = async (obj, args) => {
  const { code, password } = args

  const passwordReset = await PasswordReset.query()
    .where({ code })
    .debug(true)
    .where('createdAt', '>', moment().subtract(EXPIRATION_TIME))
    .first()
  if (!passwordReset)
    return {
      error: 'Your code has expired',
    }

  if (password.length < 6)
    return { error: 'Your password must be 6 characters or greater.' }
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await passwordReset.$relatedQuery('user').first()

  await user.update({
    password: hashedPassword,
  })

  const payload = {
    userId: user.id,
  }
  const token = jwt.sign(payload, config.jwtSecret)

  return {
    user,
    token,
  }
}

module.exports = {
  Mutation: {
    resetUserPassword: resetUserPasswordResolver,
  },
}
