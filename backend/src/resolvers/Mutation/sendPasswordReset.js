const randomstring = require('randomstring')

const User = require('../../models/User')
const PasswordReset = require('../../models/PasswordReset')
const sendEmail = require('../../utils/sendEmail')

const sendPasswordResetResolver = async (obj, args) => {
  const { email: inputEmail } = args

  const email = inputEmail.toLowerCase()

  const user = await User.query()
    .where({ email })
    .first()

  if (!user) return false

  const passwordReset = await PasswordReset.query()
    .insert({
      userId: user.id,
      code: randomstring.generate(),
    })
    .returning('*')

  const msg = `
  You can reset your password here: https://www.blocksync.app/reset/${
    passwordReset.code
  }

  Blocksync
  `
  await sendEmail({
    to: email,
    body: msg,
    subject: 'Blocksync - Password Reset',
  })

  return true
}

module.exports = {
  Mutation: {
    sendPasswordReset: sendPasswordResetResolver,
  },
}
