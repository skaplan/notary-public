const config = require('../../config/')
const { sesClient } = require('../../config/aws')

const sendEmail = async ({ to, body, subject }) => {
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: config.fromEmailAddress,
  }
  await sesClient.sendEmail(params).promise()
}

module.exports = sendEmail
