const crypto = require('crypto')
const log = require('loglevel')

const { Model, transaction } = require('objection')
const config = require('../../config/')

const RootNode = require('../models/RootNode')
const { docClient } = require('../../config/aws')

const getItem = async key => {
  const params = {
    TableName: config.dynamoTable,
    Key: {
      key,
    },
  }
  const { Item } = await docClient.get(params).promise()
  return Item
}

const putItem = async item => {
  const params = {
    TableName: config.dynamoTable,
    Item: item,
  }
  return docClient.put(params).promise()
}

const join = async () => {
  await transaction(Model.knex(), async trx => {
    const [leftNode, rightNode] = await RootNode.query(trx)
      .where('status', 'pending')
      .orderBy('count', 'desc')
      .limit(2)

    if (!rightNode) return
    log.info('Joining ', leftNode.id, ' and ', rightNode.id)

    const leftItem = await getItem(leftNode.key)
    const rightItem = await getItem(rightNode.key)

    const leftHash = Buffer.from(leftItem.hash, 'hex')
    const rightHash = Buffer.from(rightItem.hash, 'hex')
    const rootHash = crypto
      .createHash('sha256')
      .update(Buffer.concat([leftHash, rightHash]))
      .digest()
      .toString('hex')

    const rootItem = {
      key: rootHash,
      hash: rootHash,
      parent: null,
      left: leftItem.hash,
      right: rightItem.hash,
      type: 'root',
    }
    await putItem(rootItem)

    /**
      valid means that the node will be eventually linked to a block.
      this is to guard against the case where a worker inserts part of
      a tree, but fails before adding the root to the RootNodes table.
      to check that a given leaf is valid, we just need to find a valid
      parent (as opposed to requiring to expensivley traverse to the
      root included in a block). the leaf is checked valid whenever
      the same hash is proposed for inclusion. we don't want to
      override an earlier proof, but do want to rewrite failed nodes
     */
    const updatedLeftItem = {
      ...leftItem,
      parent: rootHash,
      valid: true,
    }
    await putItem(updatedLeftItem)
    const updatedRightItem = {
      ...rightItem,
      parent: rootHash,
      valid: true,
    }
    await putItem(updatedRightItem)

    const rootNode = await RootNode.query(trx).insertAndFetch({
      key: rootHash,
      count: leftNode.count + rightNode.count,
      status: 'pending',
    })

    await leftNode
      .$query(trx)
      .update({ status: 'joined', parentNodeId: rootNode.id })
    await rightNode
      .$query(trx)
      .update({ status: 'joined', parentNodeId: rootNode.id })
    log.info(`Join success ${rootNode.id}`)
  })
}

module.exports = join
