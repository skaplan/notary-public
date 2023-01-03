const log = require('loglevel')
const _ = require('lodash')

require('../config/log')
require('../config/db')
const sync = require('./tasks/sync/')
const { sleep } = require('./utils')
const config = require('../config/')

const WORKER_SLEEP = 5000

async function main(num) {
  log.debug(`Syncworker ${num} started`)

  while (true) {
    try {
      await sync()
    } catch (e) {
      log.error('syncWorker (runSync) failed!', e)
    }
    await sleep(WORKER_SLEEP)
  }
}

_.range(config.syncWorkerConcurrency).forEach(i => main(i))
