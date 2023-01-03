const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../../../config/')
const User = require('../../models/User')

const ERROR_MESSAGE = 'Invalid email or password.'
const loginUserResolver = async (obj, args) => {
  const { email, password } = args

  const user = await User.query()
    .where({ email })
    .first()
  if (!user)
    return {
      error: ERROR_MESSAGE,
    }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return { error: ERROR_MESSAGE }

  const payload = {
    userId: user.id,
  }
  const token = jwt.sign(payload, config.jwtSecret)

  return {
    token,
    user,
  }
}

module.exports = {
  Mutation: {
    loginUser: loginUserResolver,
  },
}
