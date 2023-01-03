const validator = require('validator')

const User = require('../../models/User')

const updateEmailResolver = async (obj, args, { user }) => {
  if (!user) throw new Error('Must be logged in.')

  const { newEmail } = args

  if (!validator.isEmail(newEmail)) return { error: 'Email is invalid.' }

  const existingUser = await User.query()
    .where({ email: newEmail })
    .first()

  if (existingUser)
    return { error: 'A user with the same email already exists.' }

  const updatedUser = await user
    .$query()
    .update({ email: newEmail })
    .returning('*')

  return {
    user: updatedUser,
  }
}

module.exports = {
  Mutation: {
    updateEmail: updateEmailResolver,
  },
}
