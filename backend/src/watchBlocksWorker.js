const log = require('loglevel')
require('../config/log')
require('../config/db')

const watchBlocks = require('./tasks/watchBlocks')
const { sleep } = require('./utils')

const WORKER_SLEEP = 5000

async function main() {
  while (true) {
    try {
      await watchBlocks()
    } catch (error) {
      log.warn('Run watch blocks error', error)
    }
    await sleep(WORKER_SLEEP)
  }
}

main()
