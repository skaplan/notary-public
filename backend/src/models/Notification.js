const { Model } = require('objection')
const BaseModel = require('./BaseModel')
const User = require('./User.js')

class Notification extends BaseModel {
  static get tableName() {
    return 'Notifications'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'Notifications.userId',
          to: 'Users.id',
        },
      },
    }
  }
}

module.exports = Notification
