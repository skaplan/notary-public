const log = require('loglevel')
const crypto = require('crypto')

require('../config/log')

const proof = `
[
  {
    "hash": "edeaaff3f1774ad2888673770c6d64097e391bc362d7d6fb34982ddf0efd18cb",
    "left": null,
    "right": null
  },
  {
    "hash": "e3d90cb2da41add5bbfe60ef3bed61682da22c3e391a6f906f393e70df6ca013",
    "left": "edeaaff3f1774ad2888673770c6d64097e391bc362d7d6fb34982ddf0efd18cb",
    "right": "681a973c5264cf7d7d032489e93f140411063ee34c908fcb1c3dcf8b97e9596c"
  },
  {
    "hash": "98b6b1b25a5cf9e7024584bdf62fd6f01e008ea38a68f7421caea9679c4322ba",
    "left": "785c5306806fe0a45997ac8138658eee64848feae37b2a906f12748d0edd6360",
    "right": "e3d90cb2da41add5bbfe60ef3bed61682da22c3e391a6f906f393e70df6ca013"
  },
  {
    "hash": "2717747bde21a38129e3e2c7b3509376b3e3a84f74576f1f060765a97c6343da",
    "left": "05348c94dd0786f9ed34ae512f43cfcd2d841edac92e977c68d99242def39fae",
    "right": "98b6b1b25a5cf9e7024584bdf62fd6f01e008ea38a68f7421caea9679c4322ba"
  },
  {
    "hash": "c8ca1ccc3661dfcfd3347b3f77f08ec9f9e1d94011971a2182f37405c94395d4",
    "left": "598b5c31bf91656056c98ee88355122d02bd7134bc5835c477cec210035cfe9f",
    "right": "2717747bde21a38129e3e2c7b3509376b3e3a84f74576f1f060765a97c6343da"
  },
  {
    "hash": "a60ac44a26eb61ca3c89bb4318dd5d53e3a95778dd94254e8fee70b6b9622fae",
    "left": "433c623f57efeedabc40a9539516d8dad50d3336ee069216b61afda2e8b465b3",
    "right": "c8ca1ccc3661dfcfd3347b3f77f08ec9f9e1d94011971a2182f37405c94395d4"
  }
]`

const proofNodes = JSON.parse(proof)

const concatHashes = (left, right) =>
  crypto
    .createHash('sha256')
    .update(
      Buffer.concat([Buffer.from(left, 'hex'), Buffer.from(right, 'hex')]),
    )
    .digest()
    .toString('hex')

const valid = (nodes, prevHash) => {
  const [first, ...rest] = nodes

  // base case where nodes = []
  if (!first) return true

  // leaves only have a hash and no (left/right) children
  const isLeaf = !(first.left || first.right)
  if (!isLeaf) {
    // first.hash should = h(first.left + first.right)
    const hashIsCorrect = concatHashes(first.left, first.right) === first.hash
    if (!hashIsCorrect) return false
  }

  if (prevHash) {
    const previousIsAChildOfCurrent =
      first.left === prevHash || first.right === prevHash
    if (!previousIsAChildOfCurrent) return false
  }

  return valid(rest, first.hash)
}

const v = valid(proofNodes)

const first = proofNodes[0].hash
const last = proofNodes[proofNodes.length - 1].hash

if (v) {
  log.info(`${last} proves ${first}`)
} else {
  log.info('naw')
}
