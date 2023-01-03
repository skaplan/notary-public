const axios = require('axios')
const jwt = require('jsonwebtoken')

const config = require('../../../config/')
const User = require('../../models/User')
const SyncJob = require('../../models/SyncJob')

const sendEmail = require('../../utils/sendEmail')

const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token'
const DROPBOX_API_URL = 'https://api.dropboxapi.com/2'
const GET_ACCOUNT_URL = `${DROPBOX_API_URL}/users/get_account`

const loginUserOauthResolver = async (obj, args) => {
  // try catch because axios returns circular object (cant be jsonifyed = error)
  try {
    const { oauthCode } = args

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

    const user = await User.query()
      .where({ dropboxId: accountId })
      .first()

    if (user) {
      const payload = {
        userId: user.id,
      }
      const jwtToken = jwt.sign(payload, config.jwtSecret)
      return {
        token: jwtToken,
      }
    }

    const accountResponse = await axios({
      method: 'POST',
      url: GET_ACCOUNT_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: { account_id: accountId },
    })

    const { email: dropboxEmail } = accountResponse.data
    const email = dropboxEmail.toLowerCase()

    const existingEmailUser = await User.query()
      .where({ email })
      .first()
    if (existingEmailUser)
      return {
        error: `You already have an account with email ${email}. Please add the Dropbox account from your settings.`,
      }

    const newUser = await User.query()
      .insert({
        dropboxId: accountId,
        status: 'active',
        email,
        token: accessToken,
      })
      .returning('*')

    await SyncJob.query().insert({
      userId: newUser.id,
      status: 'pending',
      retries: 0,
      startAt: new Date(),
    })

    const payload = {
      userId: newUser.id,
    }
    const jwtToken = jwt.sign(payload, config.jwtSecret)

    const msg = `
    Welcome to Blocksync! You can now generate and manage proofs.
  
    We'll let you know when your Dropbox finishes its inital sync. This can take a while (a few days) depending on the size of your Dropbox.

    Blocksync
    `

    await sendEmail({
      to: email,
      body: msg,
      subject: 'Welcome to Blocksync',
    })

    return {
      token: jwtToken,
    }
  } catch (e) {
    throw new Error("Can't authenticate with Dropbox")
  }
}

module.exports = {
  Mutation: {
    loginUserOauth: loginUserOauthResolver,
  },
}
