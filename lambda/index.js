const es = require('elasticsearch')

const client = es.Client({
  hosts: ['https://search-blocksync-search-.us-east-1.es.amazonaws.com'],
  connectionClass: require('http-aws-es'),
})

const processRecord = async (record) => {
  const {
    eventName,
    dynamodb: { NewImage: item, OldImage: oldItem },
  } = record

  if (eventName === 'INSERT' || eventName === 'MODIFY') {
    if (item.type.S !== 'leaf' || !item.userId) return

    const title = item.title.S
    const addedAt = item.addedAt.S
    const fileType = item.fileType.S
    const userId = item.userId.S
    const key = item.key.S
    const hash = item.hash.S

    await client.index({
      index: 'files',
      type: 'doc',
      id: key,
      body: {
        title,
        addedAt,
        fileType,
        userId,
        hash,
      },
    })
  }

  if (eventName === 'REMOVE') {
    if (oldItem.type.S !== 'leaf') return

    const key = oldItem.key.S
    await client.delete({
      index: 'files',
      type: 'doc',
      id: key,
    })
  }
}

const handler = async (event) => {
  const { Records } = event

  for (const record of Records) {
    await processRecord(record)
  }
}

module.exports = {
  handler,
}
