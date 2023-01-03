const crypto = require('crypto')
const _ = require('lodash')

const config = require('../../config/')
const { docClient } = require('../../config/aws')

const getKey = async key => {
  if (!key) return null

  const getParams = {
    TableName: config.dynamoTable,
    Key: {
      key,
    },
  }

  const response = await docClient.get(getParams).promise()
  return response.Item
}

const getPathToRoot = async key => {
  const node = await getKey(key)

  if (!node) return []

  const parentPathToRoot = await getPathToRoot(node.parent)
  return [node, ...parentPathToRoot]
}

const getFile = async (userId, hash) => {
  const userIdHash = crypto
    .createHash('sha256')
    .update(userId)
    .digest()

  const key = crypto
    .createHash('sha256')
    .update(Buffer.concat([userIdHash, Buffer.from(hash, 'hex')]))
    .digest()
    .toString('hex')

  const pathToRoot = await getPathToRoot(key)

  if (pathToRoot.length < 1) {
    return null
  }

  const root = _.last(pathToRoot)
  const leaf = _.first(pathToRoot)

  const { block, transactionId } = root

  if (!block) {
    return leaf
  }

  const { height } = block

  const proofNodes = pathToRoot.map(node => {
    return {
      hash: node.hash,
      left: node.left,
      right: node.right,
    }
  })

  return {
    blockNumber: height,
    transactionId,
    proof: {
      nodes: proofNodes,
    },
    ...leaf,
  }
}

module.exports = getFile
