const log = require('loglevel')
const config = require('./index')

log.setLevel(config.logLevel)
