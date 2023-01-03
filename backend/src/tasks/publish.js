const log = require('loglevel')
const { Model, transaction } = require('objection')
const { PrivateKey, Transaction } = require('bitcore-lib')
const axios = require('axios')
const moment = require('moment')

require('../../config/log')
require('../../config/db')
const config = require('../../config/')
const { docClient } = require('../../config/aws')
const RootNode = require('../models/RootNode')
const TransactionModel = require('../models/Transaction')

const PUBLISH_INTERVAL = moment.duration(4, 'hour')

const CHECK_INTERVAL = moment.duration(10, 'minutes')
const TX_SIZE_PER_KILO = 0.25

const publishHash = async hash => {
  const privateKey = new PrivateKey(config.blockchainPrivateKey)
  const publicKey = privateKey.toPublicKey()
  const address = publicKey.toAddress(config.blockchainNetwork)

  const utxoResponse = await axios({
    url: `${config.blockcypherApiUrl}/addrs/${address}`,
    method: 'GET',
    params: {
      unspentOnly: true,
      includeScript: true,
    },
  })

  const { txrefs = [], unconfirmed_txrefs = [] } = utxoResponse.data
  const txs = txrefs.concat(unconfirmed_txrefs)
  if (!txs) {
    log.error('Out of bitcoin')
    throw new Error('Out of Bitcoin')
  }

  const utxos = txs.map(txref => ({
    txId: txref.tx_hash,
    outputIndex: txref.tx_output_n,
    address,
    script: txref.script,
    satoshis: txref.value,
  }))

  const estimateFeeResponse = await axios({
    url: `${config.blockcypherApiUrl}`,
    method: 'GET',
    params: {
      token: config.blockcypherApiToken,
    },
  })
  const satoshiPerKbFee = estimateFeeResponse.data.medium_fee_per_kb
  if (!satoshiPerKbFee) {
    log.error(`no fee estimate`)
    throw new Error('no fee estimate')
  }

  const btcTransaction = new Transaction()
    .from(utxos)
    .addData(hash)
    .change(address)
    .fee(satoshiPerKbFee * TX_SIZE_PER_KILO)
    .sign(privateKey)

  const sendResponse = await axios({
    url: `${config.blockcypherApiUrl}/txs/push`,
    data: { tx: btcTransaction.serialize() },
    method: 'POST',
    params: {
      token: config.blockcypherApiToken,
    },
  })

  log.info(`Sent transaction ${sendResponse.data.tx.hash}`)
  return sendResponse.data.tx.hash
}

const publish = async () => {
  await transaction(Model.knex(), async trx => {
    const lastTransaction = await TransactionModel.query(trx)
      .orderBy('createdAt', 'desc')
      .first()

    if (
      moment().subtract(PUBLISH_INTERVAL) < moment(lastTransaction.createdAt)
    ) {
      return
    }

    const rootNode = await RootNode.query(trx)
      .where('status', 'pending')
      .orderBy('count', 'desc')
      .first()

    if (!rootNode) {
      log.debug('No rootNode')
      return
    }

    log.info('Publishing ', rootNode.id)

    const getParams = {
      TableName: config.dynamoTable,
      Key: {
        key: rootNode.key,
      },
    }
    const response = await docClient.get(getParams).promise()
    const { Item: nodeItem } = response

    const { hash } = nodeItem

    const transactionId = await publishHash(Buffer.from(hash, 'hex'))

    const updatedItem = {
      ...nodeItem,
      transactionId,
    }
    const putParams = {
      TableName: config.dynamoTable,
      Item: updatedItem,
    }
    await docClient.put(putParams).promise()

    await rootNode.$query(trx).update({
      status: 'saved',
    })

    await TransactionModel.query(trx).insert({
      status: 'pending',
      blockchainTxId: transactionId,
      key: rootNode.key,
      checkAfter: moment()
        .add(CHECK_INTERVAL)
        .toDate(),
    })

    log.info('Success ', rootNode.id, ' with tx ', transactionId)
  })
}

module.exports = publish
