const bcrypt = require('bcrypt')

const updatePasswordResolver = async (obj, args, { user }) => {
  if (!user) throw new Error('Must be logged in.')

  const { oldPassword, newPassword } = args
  if (user.password) {
    if (!oldPassword)
      return {
        error: 'Must include current password.',
      }

    const valid = await bcrypt.compare(oldPassword, user.password)
    if (!valid) return { error: 'Invalid current password.' }
  }

  if (newPassword.length < 6)
    return { error: 'Your password must be 6 characters or greater.' }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  const updatedUser = await user
    .$query()
    .update({ password: hashedPassword })
    .returning('*')

  return {
    user: updatedUser,
  }
}

module.exports = {
  Mutation: {
    updatePassword: updatePasswordResolver,
  },
}
