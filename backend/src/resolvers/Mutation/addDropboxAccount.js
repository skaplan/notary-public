const axios = require('axios')
const { transaction } = require('objection')

const config = require('../../../config/')
const User = require('../../models/User')
const SyncJob = require('../../models/SyncJob')

const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token'

const knex = User.knex()

const addDropboxAccountResolver = async (obj, args, { user }) => {
  if (!user) {
    throw new Error('Must be logged in.')
  }

  return transaction(knex, async trx => {
    const { oauthCode } = args

    if (user.dropboxId)
      return {
        error:
          'Please remove your current Dropbox account before adding a new one.',
      }

    const tokenResponse = await axios({
      method: 'POST',
      url: DROPBOX_TOKEN_URL,
      params: {
        code: oauthCode,
        grant_type: 'authorization_code',
        client_id: config.dropboxAppId,
        client_secret: config.dropboxAppSecret,
        redirect_uri: config.dropboxRedirectUrl,
      },
    })

    const {
      account_id: accountId,
      access_token: accessToken,
    } = tokenResponse.data

    const existingUser = await User.query(trx)
      .where({ dropboxId: accountId })
      .first()

    if (existingUser)
      return {
        error: 'This Dropbox account is already associated with another user.',
      }

    const updatedUser = await user
      .$query(trx)
      .update({
        dropboxId: accountId,
        status: 'active',
        token: accessToken,
      })
      .returning('*')

    const existingSyncJob = await SyncJob.query(trx)
      .where({ userId: updatedUser.id, status: 'pending' })
      .first()

    if (!existingSyncJob) {
      await SyncJob.query(trx).insert({
        userId: updatedUser.id,
        status: 'pending',
        retries: 0,
        startAt: new Date(),
      })
    }

    return {
      user: updatedUser,
    }
  })
}

module.exports = {
  Mutation: {
    addDropboxAccount: addDropboxAccountResolver,
  },
}
