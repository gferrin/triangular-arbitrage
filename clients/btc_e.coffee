
BTCE = require('btc-e')
config = require('../config/config')
fs = require('fs')
currentNonce = 0

btce = new BTCE(config.BTCE_API_KEY, config.BTCE_SECRET,
  ()-> 
    currentNonce++
    fs.writeFile("nonce.json", currentNonce)
    return currentNonce
)

module.exports = btce

