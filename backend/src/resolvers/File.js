const Notification = require('../models/Notification')

const idResolver = async file => file.key

const viewerStarredResolver = async (file, args, { user }) => {
  if (!user) return false

  const { hash } = file
  const starredFile = await user
    .$relatedQuery('starredFiles')
    .where({ hash })
    .first()

  return Boolean(starredFile)
}

const viewerIsOwnerResolver = async (file, args, { user }) => {
  if (!user) return false

  return file.userId === user.id
}

const viewerSubscribedResolver = async (file, args, { user }) => {
  if (!user) return false

  const notification = await Notification.query()
    .where({
      userId: user.id,
      hash: file.hash,
    })
    .first()

  return Boolean(notification)
}

module.exports = {
  File: {
    id: idResolver,
    viewerStarred: viewerStarredResolver,
    viewerIsOwner: viewerIsOwnerResolver,
    viewerSubscribed: viewerSubscribedResolver,
  },
}
