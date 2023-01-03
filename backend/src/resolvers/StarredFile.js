const getFile = require('../utils/getFile')

const fileResolver = async starredFile => {
  return getFile(starredFile.userId, starredFile.hash)
}

module.exports = {
  StarredFile: {
    file: fileResolver,
  },
}
