const log = require('loglevel')

const RootNode = require('../models/RootNode')
const config = require('../../config/')
const makeTree = require('./makeTree')
const { docClient } = require('../../config/aws')

const checkValid = async key => {
  const params = {
    TableName: config.dynamoTable,
    Key: {
      key,
    },
  }
  const { Item } = await docClient.get(params).promise()
  if (!Item) return false

  const { valid, parent } = Item

  if (valid) return true
  if (!parent) return false

  return checkValid(parent)
}

const saveNodes = async nodes => {
  for (const node of nodes) {
    const params = {
      TableName: config.dynamoTable,
      Item: node,
    }
    try {
      await docClient
        .put({
          ...params,
          ConditionExpression: 'attribute_not_exists(#k)',
          ExpressionAttributeNames: { '#k': 'key' },
        })
        .promise()
    } catch (e) {
      if (
        e.name === 'ConditionalCheckFailedException' &&
        e.statusCode === 400
      ) {
        const valid = await checkValid(node.key)
        log.debug(`node ${node.key} is a duplicate. valid ${valid}`)
        if (!valid) {
          await docClient.put(params).promise()
        }
      } else {
        throw e
      }
    }
  }
}

const saveRootNode = async (trx, node, count, jobId) => {
  await RootNode.query(trx).insert({
    key: node.key,
    count,
    syncJobId: jobId,
    status: 'pending',
  })
}

const saveHashes = async (trx, hashedFiles, userId, jobId) => {
  const nodes = await makeTree(hashedFiles, userId)
  await saveNodes(nodes)

  const rootNode = nodes.find(node => node.parent === null)

  // nodes could be empty
  if (rootNode) await saveRootNode(trx, rootNode, hashedFiles.length, jobId)
}

module.exports = saveHashes
