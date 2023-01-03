const { Model } = require('objection')
const BaseModel = require('./BaseModel')
const User = require('./User.js')

class SyncJob extends BaseModel {
  static get tableName() {
    return 'SyncJobs'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'SyncJobs.userId',
          to: 'Users.id',
        },
      },
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: SyncJob,
        join: {
          from: 'SyncJobs.parentId',
          to: 'SyncJobs.id',
        },
      },
      child: {
        relation: Model.HasOneRelation,
        modelClass: SyncJob,
        join: {
          from: 'SyncJobs.id',
          to: 'SyncJobs.parentId',
        },
      },
    }
  }
}

module.exports = SyncJob
