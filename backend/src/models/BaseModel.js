const { Model } = require('objection')

class BaseModel extends Model {
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }
}

module.exports = BaseModel
