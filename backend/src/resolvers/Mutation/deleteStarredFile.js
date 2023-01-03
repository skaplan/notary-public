const getFile = require('../../utils/getFile')

const deleteStarredFileResolver = async (obj, args, { user }) => {
  const { hash } = args

  if (!user) throw new Error('Must be logged in.')

  const starredFile = await user
    .$relatedQuery('starredFiles')
    .where({
      hash,
      userId: user.id,
    })
    .first()

  if (!starredFile) {
    throw new Error("Can't find file.")
  }

  await starredFile.$query().delete()

  return getFile(starredFile.userId, starredFile.hash)
}

module.exports = {
  Mutation: {
    deleteStarredFile: deleteStarredFileResolver,
  },
}
