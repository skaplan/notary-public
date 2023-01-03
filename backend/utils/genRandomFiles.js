const fs = require('fs')
const randomstring = require('randomstring')
const crypto = require('crypto')

const folder = process.argv[2]

for (let i = 0; i < 5000; i += 1) {
  const writeStream = fs.createWriteStream(
    `${folder}/${randomstring.generate(7)}.txt`,
  )

  const buffer = crypto.randomBytes(1024 * 50)

  writeStream.write(buffer)
  writeStream.end()
}

// `${folder}/${randomstring.generate(7)}.txt`
