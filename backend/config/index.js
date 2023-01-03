require('dotenv').config()

const config = {
  databaseUrl: process.env.DATABASE_URL,
  dynamoTable: process.env.DYNAMO_TABLE,
  dropboxAccessToken: process.env.DROPBOX_ACCESS_TOKEN,
  logLevel: process.env.LOG_LEVEL,
  awsRegion: process.env.AWS_REGION,
  awsAccessKey: process.env.AWS_ACCESS_KEY,
  awsSecret: process.env.AWS_SECRET,
  blockchainNetwork: process.env.BLOCKCHAIN_NETWORK,
  blockchainPrivateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
  blockcypherApiUrl: process.env.BLOCKCYPHER_API_URL,
  port: process.env.PORT,
  dropboxAppId: process.env.DROPBOX_APP_ID,
  dropboxAppSecret: process.env.DROPBOX_APP_SECRET,
  dropboxRedirectUrl: process.env.DROPBOX_REDIRECT_URL,
  jwtSecret: process.env.JWT_SECRET,
  fromEmailAddress: process.env.FROM_EMAIL_ADDRESS,
  elasticsearchUrl: process.env.ELASTICSEARCH_URL,
  blockcypherApiToken: process.env.BLOCKCYPHER_API_TOKEN,
  syncFileConcurrency: parseInt(process.env.SYNC_FILE_CONCURRENCY, 10),
  syncWorkerConcurrency: parseInt(process.env.SYNC_WORKER_CONCURRENCY, 10),
}

module.exports = config
