const config = require('./config/')

module.exports = {
  client: 'pg',
  connection: `${config.databaseUrl}?ssl=require`,
  migrations: {
    directory: './config/migrations',
    stub: './config/migrations/template.stub',
  },
}
