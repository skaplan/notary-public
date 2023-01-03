const log = require('loglevel')
require('../config/log')
require('../config/db')

const watchNotifications = require('./tasks/watchNotifications')
const { sleep } = require('./utils')

const WORKER_SLEEP = 1000

async function main() {
  while (true) {
    try {
      await watchNotifications()
    } catch (error) {
      log.warn('Run notifications error', error)
    }
    await sleep(WORKER_SLEEP)
  }
}

main()
