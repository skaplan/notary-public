const SyncJob = require('../../models/SyncJob')

const startSyncingResolver = async (obj, args, { user }) => {
  if (!user) throw new Error('Must be logged in.')

  if (user.status === 'active') throw new Error('Already syncing')

  const updatedUser = await user
    .$query()
    .update({
      status: 'active',
    })
    .returning('*')

  const lastSyncJob = await SyncJob.query()
    .where({ userId: updatedUser.id })
    .orderBy('createdAt', 'desc')
    .first()

  const cursor = lastSyncJob ? lastSyncJob.cursor : null

  const existingSyncJob = await SyncJob.query()
    .where({ userId: updatedUser.id, status: 'pending' })
    .first()

  if (!existingSyncJob) {
    await SyncJob.query().insert({
      userId: updatedUser.id,
      status: 'pending',
      retries: 0,
      startAt: new Date(),
      cursor,
    })
  }

  return updatedUser
}

module.exports = {
  Mutation: {
    startSyncing: startSyncingResolver,
  },
}
