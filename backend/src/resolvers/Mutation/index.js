const _ = require('lodash')
const loginUser = require('./loginUser')
const loginUserOauth = require('./loginUserOauth')
const createAlias = require('./createAlias')
const createStarredFile = require('./createStarredFile')
const deleteStarredFile = require('./deleteStarredFile')
const createUser = require('./createUser')
const addDropboxAccount = require('./addDropboxAccount')
const updatePassword = require('./updatePassword')
const pauseSyncing = require('./pauseSyncing')
const startSyncing = require('./startSyncing')
const createFile = require('./createFile')
const createNote = require('./createNote')
const createNotification = require('./createNotification')
const updateFileTitle = require('./updateFileTitle')
const sendPasswordReset = require('./sendPasswordReset')
const resetUserPassword = require('./resetUserPassword')
const updateEmail = require('./updateEmail')
const disassociateDropboxAccount = require('./disassociateDropboxAccount')

const resolvers = _.merge(
  loginUser,
  loginUserOauth,
  createAlias,
  createStarredFile,
  deleteStarredFile,
  createUser,
  updatePassword,
  addDropboxAccount,
  pauseSyncing,
  startSyncing,
  createFile,
  createNote,
  createNotification,
  updateFileTitle,
  sendPasswordReset,
  resetUserPassword,
  updateEmail,
  disassociateDropboxAccount,
)

module.exports = resolvers
