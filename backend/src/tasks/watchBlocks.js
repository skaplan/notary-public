const objection = require('objection')
const axios = require('axios')
const moment = require('moment')
const log = require('loglevel')

const config = require('../../config/')
const { docClient } = require('../../config/aws')
const TransactionModel = require('../models/Transaction')

const CHECK_INTERVAL = moment.duration(5, 'minutes')

const watchBlocks = async () => {
  await objection.transaction(objection.Model.knex(), async trx => {
    const bTransaction = await TransactionModel.query(trx)
      .where('checkAfter', '<', new Date())
      .andWhere('status', 'pending')
      .first()

    if (!bTransaction) {
      return
    }

    const txid = bTransaction.blockchainTxId
    const txResponse = await axios({
      url: `${config.blockcypherApiUrl}/txs/${txid}`,
      method: 'GET',
      params: {
        token: config.blockcypherApiToken,
      },
    })
    const txData = txResponse.data

    if (txData.block_height < 0) {
      await bTransaction.$query(trx).update({
        checkAfter: moment()
          .add(CHECK_INTERVAL)
          .toDate(),
      })
      return
    }

    const getParams = {
      TableName: config.dynamoTable,
      Key: {
        key: bTransaction.key,
      },
    }

    const response = await docClient.get(getParams).promise()
    const { Item } = response

    const updatedItem = {
      ...Item,
      block: {
        height: txData.block_height,
        time: txData.confirmed,
      },
    }
    const putParams = {
      TableName: config.dynamoTable,
      Item: updatedItem,
    }
    await docClient.put(putParams).promise()

    await bTransaction.$query(trx).update({
      status: 'complete',
    })

    log.info(`Updated transaction ${txid}`)
  })
}

module.exports = watchBlocks
