const Alias = require('../models/Alias')
const getFile = require('../utils/getFile')

const getAliasedFile = async aliasId => {
  const alias = await Alias.query()
    .where({ id: aliasId })
    .first()

  const { userId, hash } = alias
  return getFile(userId, hash)
}

const fileResolver = async (obj, args, { user }) => {
  const { hash, aliasId } = args
  const userId = user ? user.id : ''

  if (aliasId) {
    return getAliasedFile(aliasId)
  }

  return getFile(userId, hash)
}

const viewerResolver = async (obj, args, { user }) => {
  return user
}

module.exports = {
  Query: {
    file: fileResolver,
    viewer: viewerResolver,
  },
}
