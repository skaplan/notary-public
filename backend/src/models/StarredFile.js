const { Model } = require('objection')
const BaseModel = require('./BaseModel')

class StarredFile extends BaseModel {
  static get tableName() {
    return 'StarredFiles'
  }

  static get relationMappings() {
    const User = require('./User')
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'StarredFiles.userId',
          to: 'Users.id',
        },
      },
    }
  }
}

module.exports = StarredFile
