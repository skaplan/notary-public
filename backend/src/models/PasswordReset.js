const { Model } = require('objection')
const BaseModel = require('./BaseModel')
const User = require('./User.js')

class PasswordReset extends BaseModel {
  static get tableName() {
    return 'PasswordResets'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'PasswordResets.userId',
          to: 'Users.id',
        },
      },
    }
  }
}

module.exports = PasswordReset
