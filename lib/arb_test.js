var arbitrage = require('./arbitrage_functions');
var PAIRS = require('../config/btce_pairs');

console.log(arbitrage.search_pairs('usd_btc', PAIRS));