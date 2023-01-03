const { Model } = require('objection')
const BaseModel = require('./BaseModel')
const SyncJob = require('./SyncJob.js')

class RootNode extends BaseModel {
  static get tableName() {
    return 'RootNodes'
  }

  static get relationMappings() {
    return {
      syncJob: {
        relation: Model.BelongsToOneRelation,
        modelClass: SyncJob,
        join: {
          from: 'RootNodes.syncJobId',
          to: 'SyncJobs.id',
        },
      },
      parentNode: {
        relation: Model.BelongsToOneRelation,
        modelClass: RootNode,
        join: {
          from: 'RootNodes.parentNodeId',
          to: 'RootNodes.id',
        },
      },
    }
  }
}

module.exports = RootNode
