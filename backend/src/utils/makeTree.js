const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const _ = require('lodash')
const moment = require('moment')

const makeTree = (inputHashedFiles, userId) => {
  if (inputHashedFiles.length < 1) return []

  // remove duplicates
  const hashedFiles = _.uniqWith(
    inputHashedFiles,
    (x, y) => Buffer.compare(x.hash, y.hash) === 0,
  )
  const userIdHash = crypto
    .createHash('sha256')
    .update(userId)
    .digest()

  const finalNodes = []

  /**
    Add a random hash so that (1) we don't need reveal the existance of another
    file when we prove that one exists (2) have unique intermediate graph nodes.
  */
  const queue = hashedFiles.map(hashedFile => {
    const { hash, title, fileType, body } = hashedFile

    const right = crypto
      .createHash('sha256')
      .update(uuidv4())
      .digest()

    const parent = crypto
      .createHash('sha256')
      .update(Buffer.concat([hash, right]))
      .digest()

    // add userId hash to key to allow duplicate hashs (across users)
    const key = crypto
      .createHash('sha256')
      .update(Buffer.concat([userIdHash, hash]))
      .digest()

    // add leaves

    const leaf = {
      key: key.toString('hex'),
      type: 'leaf',
      fileType,
      title,
      body,
      userId,
      hash: hash.toString('hex'),
      parent: parent.toString('hex'),
      addedAt: moment().toISOString(),
    }
    finalNodes.push(_.pickBy(leaf, _.identity))

    return {
      hash: parent,
      left: hash,
      right,
    }
  })

  while (queue.length > 1) {
    const left = queue.shift()
    const right = queue.shift()

    const parent = crypto
      .createHash('sha256')
      .update(Buffer.concat([left.hash, right.hash]))
      .digest()

    queue.push({
      hash: parent,
      left: left.hash,
      right: right.hash,
    })

    const nodes = [left, right]
    nodes.forEach(node => {
      finalNodes.push({
        type: 'node',
        key: node.hash.toString('hex'),
        hash: node.hash.toString('hex'),
        parent: parent.toString('hex'),
        left: node.left.toString('hex'),
        right: node.right.toString('hex'),
      })
    })
  }

  const [root] = queue
  finalNodes.push({
    type: 'root',
    key: root.hash.toString('hex'),
    hash: root.hash.toString('hex'),
    parent: null,
    left: root.left.toString('hex'),
    right: root.right.toString('hex'),
  })

  return finalNodes
}

module.exports = makeTree
