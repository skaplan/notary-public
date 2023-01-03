const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../../config/')
const sendEmail = require('../../utils/sendEmail')

const User = require('../../models/User')

const createUserResolver = async (obj, { input }) => {
  const { email: inputEmail, password } = input
  const email = inputEmail.toLowerCase()

  const existingUser = await User.query()
    .where({ email })
    .first()

  if (!validator.isEmail(email)) return { error: 'Email is invalid.' }
  if (password.length < 6)
    return { error: 'Your password must be 6 characters or greater.' }

  if (existingUser)
    return { error: 'A user with the same email already exists.' }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.query().insert({
    email,
    password: hashedPassword,
  })

  const payload = {
    userId: user.id,
  }
  const token = jwt.sign(payload, config.jwtSecret)

  const msg = `
  Welcome to Blocksync! You can now generate and manage proofs. Add your Dropbox to take advantage of our syncing feature.

  Blocksync
  `

  await sendEmail({
    to: email,
    body: msg,
    subject: 'Welcome to Blocksync',
  })

  return {
    user,
    token,
  }
}

module.exports = {
  Mutation: {
    createUser: createUserResolver,
  },
}
