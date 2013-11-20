var PAIRS = require('../config/btce_pairs');
var BTC_E_FEE = 0.002; // 0.2%

// function which returns the currencys from the pairs
var separate_pair = function( pair ){
	return pair.split('_');
};

var join_pair = function( first, second ){
	return (first + "_" + second);
}

var add_edge = function( graph, from, to, weight, callback ){
	callback( graph, from, to, weight);
};

var update_edge = function( graph, from, to, weight, callback ){
	callback( graph, from, to, weight);
};

var search_pairs = function( pair, pairs ){
    for( var p in pairs){
		if( pairs[p] == pair ){
			return true;
		}
	}
	return false;
};

// steps is the object returned from check_arbitrage
var get_volume = function( steps, book ){
    
};

var do_arbitrage = function( first, second, third, book ){
    var steps = check_arbitrage( first, second, third, book );
    if( steps.arbitrage ){
        
        
        // recursive function call
        return do_arbitrage( first, second, third, book);
    } 
    return false;
};

module.exports = {
	separate_pair: separate_pair,
    join_pair: join_pair,
	update_edge: update_edge,
	add_edge: add_edge,
    search_pairs: search_pairs,
};