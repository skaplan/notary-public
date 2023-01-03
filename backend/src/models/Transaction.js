const BaseModel = require('./BaseModel')

class Transaction extends BaseModel {
  static get tableName() {
    return 'Transactions'
  }
}

module.exports = Transaction
