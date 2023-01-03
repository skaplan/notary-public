const log = require('loglevel')
const bodyParser = require('body-parser')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const stringify = require('json-stringify-safe')

require('../config/log')
require('../config/db')
const config = require('../config/')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers/')
const User = require('./models/User')

const formatResponse = res => {
  const errors = _.get(res, 'errors', [])
  try {
    JSON.stringify(errors)
  } catch (err) {
    res.errors = JSON.parse(stringify(res.errors))
  }
  return res
}

const app = express()

app.use(cors())
app.use(bodyParser.json())

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatResponse,
  formatError: error => {
    log.error(error)
    return new Error('Internal server error')
  },
  context: async ({ req }) => {
    const { authorization } = req.headers

    if (authorization) {
      const { userId } = jwt.verify(authorization, config.jwtSecret)

      const user = await User.query()
        .where({ id: userId })
        .first()

      return {
        user,
      }
    }
    return {}
  },
})
server.applyMiddleware({ app })

app.listen(config.port, () => {
  log.info(`Apollo Server is now running on http://localhost:${config.port}`)
})
