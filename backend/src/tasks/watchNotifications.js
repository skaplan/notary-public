const objection = require('objection')
const moment = require('moment')

const Notification = require('../models/Notification')
const getFile = require('../utils/getFile')
const sendEmail = require('../utils/sendEmail')

const CHECK_INTERVAL = moment.duration('1', 'hour')

const watchNotifications = async () => {
  await objection.transaction(objection.Model.knex(), async trx => {
    const notification = await Notification.query(trx)
      .where('checkAfter', '<', new Date())
      .andWhere('status', 'pending')
      .first()

    if (!notification) {
      return
    }

    const userId = notification.userId ? notification.userId : ''

    const file = await getFile(userId, notification.hash)

    if (!file.blockNumber) {
      await notification.$query(trx).update({
        checkAfter: moment()
          .add(CHECK_INTERVAL)
          .toDate(),
      })
      return
    }

    const msg = `
    Your file https://www.blocksync.app/file/${
      notification.hash
    } was successfully placed into the blockchain.

    Blocksync
    `

    await sendEmail({
      to: notification.email,
      body: msg,
      subject: 'Blocksync - File Synced',
    })

    await notification.$query().update({ status: 'sent' })
  })
}

module.exports = watchNotifications
