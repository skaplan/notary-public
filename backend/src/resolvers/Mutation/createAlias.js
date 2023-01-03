const randomstring = require('randomstring')

const Alias = require('../../models/Alias')

const createAliasResolver = async (obj, args, { user }) => {
  const { hash } = args

  if (!user) throw new Error('User must be logged in.')

  const existingAlias = await Alias.query()
    .where({
      userId: user.id,
      hash,
    })
    .first()

  if (existingAlias) return existingAlias

  const alias = await Alias.query().insert({
    userId: user.id,
    hash,
    id: randomstring.generate({
      length: 8,
      charset: 'alphanumeric',
      readable: true,
    }),
  })

  return alias
}

module.exports = {
  Mutation: {
    createAlias: createAliasResolver,
  },
}
