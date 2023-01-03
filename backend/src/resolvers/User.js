const { esClient } = require('../../config/aws')

const MAX_RESULTS = 100
const DEFAULT_RESULTS = 20

const hasPasswordResolver = async user => {
  return Boolean(user.password)
}

const starredFilesResolver = async (user, args) => {
  const { filter } = args
  const { query: inputQuery, first = DEFAULT_RESULTS, after = 0 } = filter
  const limit = Math.min(first, MAX_RESULTS)

  const query = user.$relatedQuery('starredFiles')

  if (inputQuery) {
    query.where('title', 'ILIKE', `%${inputQuery}%`)
  }

  const result = await query
    .range(after, after + limit - 1)
    .orderBy('createdAt', 'desc')

  return {
    numCount: result.total,
    nodes: result.results,
  }
}

const jobsResolver = async (obj, { filter }, { user }) => {
  const { first = DEFAULT_RESULTS, after = 0 } = filter

  const limit = Math.min(first, MAX_RESULTS)

  const result = await user
    .$relatedQuery('syncJobs')
    .where({ status: 'complete', hasMore: false })
    .orWhere(q => q.where('status', 'pending').andWhere('numFiles', '>', 0))
    .orderBy('createdAt', 'desc')
    .range(after, after + limit - 1)

  const syncJobs = result.results
  const numCount = result.total

  const jobs = syncJobs.map((syncJob, i) => {
    const startedAt = syncJob.parentStartedAt
      ? syncJob.parentStartedAt
      : syncJob.startedAt
    const inProgress = i === 0 && after === 0 && syncJob.status === 'pending'
    return {
      id: syncJob.id,
      numFiles: syncJob.numFiles,
      startAt: startedAt.toISOString(),
      endAt: syncJob.endedAt && syncJob.endedAt.toISOString(),
      inProgress,
    }
  })
  return {
    numCount,
    nodes: jobs,
  }
}

const searchResolver = async (user, { filter }) => {
  const { query, first = DEFAULT_RESULTS, after = 0 } = filter
  const userId = user.id

  const size = Math.min(first, MAX_RESULTS)

  const response = await esClient.search({
    index: 'files',
    body: {
      query: {
        bool: {
          must: [
            {
              constant_score: {
                filter: {
                  term: {
                    userId,
                  },
                },
              },
            },
            {
              wildcard: {
                title: `*${query}*`,
              },
            },
          ],
        },
      },
      sort: [
        {
          addedAt: {
            order: 'desc',
          },
        },
      ],
      from: after,
      size,
    },
  })

  const { hits, total } = response.hits

  const results = hits.map(hit => ({
    id: hit._id,
    hash: hit._source.hash,
    title: hit._source.title,
    userId: hit._source.userId,
    fileType: hit._source.fileType,
    addedAt: hit._source.addedAt,
  }))

  return {
    numCount: total,
    nodes: results,
  }
}

module.exports = {
  User: {
    hasPassword: hasPasswordResolver,
    starredFiles: starredFilesResolver,
    jobs: jobsResolver,
    search: searchResolver,
  },
}
