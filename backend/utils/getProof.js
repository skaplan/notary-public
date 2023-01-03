const log = require('loglevel')
const config = require('../config/')
const { docClient } = require('../config/aws')

require('../config/log')

const getKey = async key => {
  if (!key) return null

  const getParams = {
    TableName: config.dynamoTable,
    Key: {
      key,
    },
  }

  const response = await docClient.get(getParams).promise()
  return response
}

const getProof = async key => {
  log.debug(key)

  const proof = []

  let response = await getKey(key)

  if (!response.Item) return null

  while (response) {
    const {
      Item: { parent, hash, left, right },
    } = response

    proof.push({
      hash,
      left,
      right,
    })

    response = await getKey(parent)
  }

  return proof
}

const main = async () => {
  const key = process.argv[2]
  const proof = await getProof(key)
  log.debug(JSON.stringify(proof))
}

main()
