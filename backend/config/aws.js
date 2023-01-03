const AWS = require('aws-sdk')
const es = require('elasticsearch')
const awsEs = require('http-aws-es')

const config = require('./index')

AWS.config.update({
  region: config.awsRegion,
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecret,
})

const docClient = new AWS.DynamoDB.DocumentClient()

const esClient = es.Client({
  hosts: [config.elasticsearchUrl],
  connectionClass: awsEs,
})

const sesClient = new AWS.SES()

module.exports = { docClient, esClient, sesClient }
