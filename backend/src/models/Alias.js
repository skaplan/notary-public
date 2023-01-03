const { Model } = require('objection')
const BaseModel = require('./BaseModel')
const User = require('./User.js')

class Alias extends BaseModel {
  static get tableName() {
    return 'Aliases'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'Aliases.userId',
          to: 'Users.id',
        },
      },
    }
  }
}

module.exports = Alias
