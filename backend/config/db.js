const { Model } = require('objection')
const Knex = require('knex')
const knexfile = require('../knexfile')

const knex = Knex(knexfile)
Model.knex(knex)

// respond to heroku shutdown event
// not sure if necessary
process.on('SIGTERM', () => {
  knex.destroy()
  process.exit()
})
