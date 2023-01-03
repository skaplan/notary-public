const getFile = require('../utils/getFile')

const fileResolver = async alias => {
  const { userId, hash } = alias
  return getFile(userId, hash)
}

module.exports = {
  Alias: {
    file: fileResolver,
  },
}
