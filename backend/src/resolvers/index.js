const _ = require('lodash')
const Query = require('./Query')
const Mutation = require('./Mutation/')
const User = require('./User')
const Alias = require('./Alias')
const File = require('./File')
const StarredFile = require('./StarredFile')

const resolvers = _.merge(Query, Mutation, User, Alias, File, StarredFile)

module.exports = resolvers
