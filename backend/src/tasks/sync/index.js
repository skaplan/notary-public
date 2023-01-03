const log = require('loglevel')

const { Model } = require('objection')
const { transaction } = require('objection')
const moment = require('moment')
const SyncJob = require('../../models/SyncJob')
const processDropboxJob = require('./processDropboxJob')
const saveHashedFiles = require('../../utils/saveHashedFiles')
const sendEmail = require('../../utils/sendEmail')
const { errorType } = require('../../constants')

const MAX_RETRIES = 3
const INITIAL_RETRY_TIME = moment.duration(15, 'minutes')

const SYNC_PERIOD = moment.duration(12, 'hours')

async function getJob(trx) {
  const query = `
    SELECT * from "SyncJobs"
    WHERE "SyncJobs"."status"='pending'
    AND "SyncJobs"."startAt" < now()
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  `
  const result = await trx.raw(query)
  const jobs = result.rows.map(row => SyncJob.fromDatabaseJson(row))
  const [job] = jobs

  return job
}

async function completeJob(trx, job, cursor, hasMore, numFiles) {
  const previousNumFiles = job.numFiles || 0
  const nextNumFiles = previousNumFiles + numFiles

  await job.$query(trx).update({
    endedAt: new Date(),
    status: 'complete',
    numFiles: nextNumFiles,
    hasMore,
  })

  const user = await job.$relatedQuery('user', trx).first()
  const morePendingJobs = await SyncJob.query(trx)
    .where({ status: 'pending', userId: user.id })
    .first()

  const previousCompletedJob = await SyncJob.query(trx)
    .where({
      status: 'complete',
      hasMore: false,
    })
    .first()

  if (!previousCompletedJob && !hasMore) {
    const msg = `
    Congratulations! Your Dropbox has completed its inital sync. You can view proofs for all of your files at our site: https://www.blocksync.app/dashboard. 

    It may take a few more hours for proof of your files to be inserted into the blockchain. On the file view, you can sign up for notifications if you would like to know when your files are officially noterized.

    Blocksync
    `
    await sendEmail({
      to: user.email,
      body: msg,
      subject: 'Blocksync - Inital Sync Completed',
    })
  }

  if (user.status === 'active' && !morePendingJobs) {
    const immediateStartAt = moment().toDate()
    const futureStartAt = moment()
      .add(SYNC_PERIOD)
      .toDate()

    const startAt = hasMore ? immediateStartAt : futureStartAt

    const parentStartedAt = job.parentStartedAt || job.startedAt

    await SyncJob.query(trx).insert({
      userId: job.userId,
      parentId: job.id,
      cursor,
      status: 'pending',
      retries: 0,
      startAt,
      numFiles: hasMore ? nextNumFiles : 0,
      parentStartedAt: hasMore ? parentStartedAt : null,
    })
  }
}

async function handleJobError(trx, job, errorMessage) {
  await job
    .$query(trx)
    .update({ endedAt: new Date(), status: 'failed', error: errorMessage })
  if (job.retries < MAX_RETRIES) {
    await SyncJob.query(trx).insert({
      userId: job.userId,
      parentId: job.id,
      cursor: job.cursor,
      status: 'pending',
      retries: job.retries + 1,
      startAt: moment()
        .add(INITIAL_RETRY_TIME.milliseconds() * 2 ** job.retries)
        .toDate(),
    })
  } else {
    const user = await job.$relatedQuery('user', trx).first()

    await user.$query(trx).update({
      status: 'error',
    })

    const msg = `
    There was an error syncing your Dropbox. You may need to login to refresh our access to your Dropbox. You can restart syncing from the Dashboard, https://www.blocksync.app/dashboard.

    If problems persist, email support@blocksync.app.

    Blocksync
    `
    await sendEmail({
      to: user.email,
      body: msg,
      subject: 'An error with your account',
    })
  }
}

async function handleAuthError(trx, job) {
  await job
    .$query(trx)
    .update({ endedAt: new Date(), status: 'failed', error: 'AUTH' })

  const user = await job.$relatedQuery('user', trx).first()

  await user.$query(trx).update({
    status: 'error',
    token: null,
  })
}

const sync = async () => {
  return transaction(Model.knex(), async trx => {
    const initialJob = await getJob(trx)

    if (!initialJob) {
      return
    }

    const job = await initialJob
      .$query(trx)
      .update({ startedAt: new Date() })
      .returning('*')

    const user = await job.$relatedQuery('user').first()

    if (!user.status) {
      await job.$query().delete()
      return
    }

    log.info(`Start job: ${job.id}`)

    try {
      const { hashedFiles, hasMore, cursor } = await processDropboxJob(
        job.cursor,
        user.token,
      )
      await saveHashedFiles(trx, hashedFiles, user.id)
      await completeJob(trx, job, cursor, hasMore, hashedFiles.length)

      log.info(`Successfully completed job: ${job.id}`)
    } catch (error) {
      if (error.type === errorType.AUTH) {
        log.info(`Auth error: ${job.id}`)
        await handleAuthError(trx, job)
        return
      }
      log.warn('Job error:', job.id, error)
      await handleJobError(trx, job, error.message)
    }
    log.info(`Finish job: ${job.id}`)
  })
}

module.exports = sync
