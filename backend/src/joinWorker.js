const log = require('loglevel')

require('../config/log')
require('../config/db')
const join = require('./tasks/join')
const { sleep } = require('./utils')

const WORKER_SLEEP = 1000

async function main() {
  while (true) {
    try {
      await join()
    } catch (e) {
      log.error('joinWorker (runJoin) failed!', e)
    }

    await sleep(WORKER_SLEEP)
  }
}

main()
