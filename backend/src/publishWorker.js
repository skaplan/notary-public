const log = require('loglevel')
const publish = require('./tasks/publish')
const { sleep } = require('./utils')

const WORKER_SLEEP = 60000

async function main() {
  while (true) {
    try {
      await publish()
    } catch (error) {
      log.warn('Run publish error', error)
    }
    await sleep(WORKER_SLEEP)
  }
}

main()
