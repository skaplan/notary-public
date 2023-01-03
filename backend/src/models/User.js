const { Model } = require('objection')
const BaseModel = require('./BaseModel')

class User extends BaseModel {
  static get tableName() {
    return 'Users'
  }

  static get relationMappings() {
    const SyncJob = require('./SyncJob')
    const Alias = require('./Alias')
    const StarredFile = require('./StarredFile')

    return {
      syncJobs: {
        relation: Model.HasManyRelation,
        modelClass: SyncJob,
        join: {
          from: 'Users.id',
          to: 'SyncJobs.userId',
        },
      },
      aliases: {
        relation: Model.HasManyRelation,
        modelClass: Alias,
        join: {
          from: 'Users.id',
          to: 'Aliases.userId',
        },
      },
      starredFiles: {
        relation: Model.HasManyRelation,
        modelClass: StarredFile,
        join: {
          from: 'Users.id',
          to: 'StarredFiles.userId',
        },
      },
    }
  }
}

module.exports = User
