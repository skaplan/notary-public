const pauseSyncingResolver = async (obj, args, { user }) => {
  if (!user) throw new Error('Must be logged in.')

  if (!(user.status === 'active')) throw new Error('Currently not syncing')

  const updatedUser = await user
    .$query()
    .update({
      status: 'inactive',
    })
    .returning('*')

  return updatedUser
}

module.exports = {
  Mutation: {
    pauseSyncing: pauseSyncingResolver,
  },
}
