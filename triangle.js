/*-------------------------------------------------------
    :: Tage (Taj) - Triangle Arbitrage Trader
    -> Gabriel Ferrin & Connor Black 
    
    Operates on triangular arbitrage opportunities
    within the BTC-e exchange.
--------------------------------------------------------*/

/*-- Dependencies --*/

// NPM
require('coffee-script');
var colors = require('colors');

// BTC-e 
var btce = require('./clients/btc_e');

var book = require('./book/Books');
var pairs = require('./config/btce_pairs');

var arbitrage = require('./lib/arbitrage_functions');
var general = require('./lib/general_functions');

// Graph C++ 
var graph_constructor = require('./build/Release/graph');

/*- Variables -*/
var BTCE_E_FEE = 0.002; // 0.2%

/*-- Initializaion --*/

var Book = new book();
var Graph = new graph_constructor.Graph();

// initializes all the books
Book.update_all(); 

// btce.on('account_info', function(info){
// 	console.log("in account info");
// 	console.log(info);
// });

// initialize the graph
setTimeout( function(){
	// Get the needed account info
	//btce.getInfo();

	for(var pair in pairs){	

		var nodes = arbitrage.separate_pair( pairs[pair] );

		Graph.add_node( nodes[0] );
		Graph.add_node( nodes[1] );	
	}
	// Need two seperate loops because if the nodes dont exist then add edge will error
	for(var pair in pairs){

		var nodes = arbitrage.separate_pair( pairs[pair] );
		arbitrage.add_edge( Graph, nodes[0], nodes[1], Book.books[pair].bid, 
			function( graph, from, to, weight ){
				graph.add_edge( from, to, "bid", weight, BTCE_E_FEE );
		});
		arbitrage.add_edge( Graph, nodes[1], nodes[0], Book.books[pair].ask, 
			function( graph, from, to, weight ){
				graph.add_edge( from, to, "ask", weight, BTCE_E_FEE );
		});
	}

	Graph.print();
	console.log(Graph.check_arbitrage( "usd"));

	setInterval(function() {

		for( var pair in pairs){
			// update the inside values for all of the pairs
			btce.ticker( pair, function(err, res){
				if( err === null ){
					Book.books[pair].update_inside(res.ticker.sell, res.ticker.buy);	
				} else {
					console.log(err);
				}
			});
			
			var nodes = arbitrage.separate_pair( pairs[pair] );

			arbitrage.update_edge( Graph, nodes[0], nodes[1], Book.books[pair].bid, 
				function( graph, from, to, weight ){
					graph.update_edge( from, to, "bid", weight, BTCE_E_FEE );
			});
			arbitrage.update_edge( Graph, nodes[1], nodes[0], Book.books[pair].ask, 
				function( graph, from, to, weight ){
					graph.update_edge( from, to, "ask", weight, BTCE_E_FEE );
			});
		}
		
		var negative_path = Graph.check_arbitrage("btc");
		console.log("Negative path " + negative_path );
		console.log(negative_path.length);
		
		if( negative_path.length > 0 ){


			// So In here we know there is a negative weight cycle

			// Need to figure out the bids and asks for for each step in 
			// the cycle and exactly which pairs will be used
			// While this is happening make sure the needed order books are updated

			// Next create a subgraph for the three cureencies. Get the vols for the trade
			// place the orders adjuct the current copys of the books, update the graph

			var pair1, pair2, pair3;
			var type1 = type2 = type3 = "bid"; // The type of trade I'm doing

			// create a subgraph 
			var sub_graph = new graph_constructor.Graph();
			// add nodes
			sub_graph.add_node( negative_path[0] );
			sub_graph.add_node( negative_path[1] );
			sub_graph.add_node( negative_path[2] );

			pair1 = arbitrage.join_pair( negative_path[0], negative_path[1] );
			pair2 = arbitrage.join_pair( negative_path[1], negative_path[2] );
			pair3 = arbitrage.join_pair( negative_path[2], negative_path[0] );

			if( !arbitrage.search_pairs(pair1, pairs) ){
				pair1 = arbitrage.join_pair( negative_path[1], negative_path[0] );
				
				arbitrage.add_edge( sub_graph, negative_path[0], negative_path[1], Book.books[pair1].ask, 
					function( graph, from, to, weight ){
						graph.add_edge( from, to, "ask", weight, BTCE_E_FEE );
				});
			} else {
				type1 = "ask";
				arbitrage.add_edge( sub_graph, negative_path[0], negative_path[1], Book.books[pair1].bid, 
					function( graph, from, to, weight ){
						graph.add_edge( from, to, "bid", weight, BTCE_E_FEE );
				});
			}

			if( !arbitrage.search_pairs(pair2, pairs) ){
				pair2 = arbitrage.join_pair( negative_path[2], negative_path[1] );

				arbitrage.add_edge( sub_graph, negative_path[1], negative_path[2], Book.books[pair2].ask, 
					function( graph, from, to, weight ){
						graph.add_edge( from, to, "ask", weight, BTCE_E_FEE );
				});
			} else {
				type2 = "ask";
				arbitrage.add_edge( sub_graph, negative_path[1], negative_path[2], Book.books[pair2].bid, 
					function( graph, from, to, weight ){
						graph.add_edge( from, to, "bid", weight, BTCE_E_FEE );
				});
			}

			if( !arbitrage.search_pairs(pair3, pairs) ){
				pair3 = arbitrage.join_pair( negative_path[0], negative_path[2] );
				
				arbitrage.add_edge( sub_graph, negative_path[2], negative_path[0], Book.books[pair3].ask, 
					function( graph, from, to, weight ){
						graph.add_edge( from, to, "ask", weight, BTCE_E_FEE );
				});
			} else {
				type3 = "ask";
				arbitrage.add_edge( sub_graph, negative_path[2], negative_path[0], Book.books[pair3].bid, 
					function( graph, from, to, weight ){
						graph.add_edge( from, to, "bid", weight, BTCE_E_FEE );
				});
			}

			Book.update( pair1 );
			Book.update( pair2 );
			Book.update( pair3 );

			sub_graph.print();

			arb_obj = {
				first: {
					type: type1,
					pair: pair1,
					vol: 0
				},
				second: {
					type: type2,
					pair: pair2,
					vol: 0
				}, 
				third: {
					type: type3,
					pair: pair3,
					vol: 0
				}
			}

			min_volume( Book, arb_obj );

			do_arbitrage( negative_path, arb_obj, function( np, obj ){
				//console.log(sub_graph.check_arbitrage(negative_path[0]));	

			});
			
		}
		negative_path = [];

	}, 2000);

}, 5000 );


var do_arbitrage = function(np, obj, cb){
	cb( np, obj);
	// if( np.length > 0 ){
	// 	do_arbitrage( obj, cb );
	// }
};

var min_volume = function( book, obj){
	var vols = [];
	// If the pair exists (x_y) it is in terms of x, otherwise in terms of y 
	// which will be the bids in this case

	// get each volume 
	// and if the type is bid, put the currency in terms of itself
	if( obj.first.type == "bid"){
		vols.push( book.books[obj.first.pair].asks[0][1] * book.books[obj.first.pair].asks[0][0] );
	} else {
		vols.push( book.books[obj.first.pair].bids[0][1] );
	}

	if( obj.second.type == "bid"){
		vols.push( book.books[obj.second.pair].asks[0][1] );
	} else{
		vols.push( book.books[obj.second.pair].bids[0][1] * book.books[obj.second.pair].bids[0][0] );
	}

	if( obj.third.type == "bid"){
		vols.push( book.books[obj.third.pair].asks[0][1] );
		vols[1] /= book.books[obj.third.pair].asks[0][0];
		console.log("in case that might make this wrong");
	} else {
		vols.push( book.books[obj.third.pair].bids[0][1] * book.books[obj.third.pair].bids[0][0] );
		vols[1] *= book.books[obj.third.pair].bids[0][0];
	}

	// then get the min of the three 
	var min = Math.min(vols[0], vols[1], vols[2]);
	
	for( var i = 0; i < vols.length; ++i ){
		vols[i] = min;
	}
	
	// now covert them back to their respective currencys

	/****** THIS STILL NEED THE FEE's REMOVED *******/
	if( obj.first.type == "bid"){
		vols[0] /= book.books[obj.first.pair].asks[0][0];
		vols[1] /= book.books[obj.first.pair].asks[0][0];
		vols[2] /= book.books[obj.first.pair].asks[0][0];
	} else {
		vols[1] *= book.books[obj.first.pair].bids[0][0];
		vols[2] *= book.books[obj.first.pair].bids[0][0];
	}

	if( obj.second.type == "bid"){
		vols[1] /= book.books[obj.second.pair].asks[0][0];
		vols[2] /= book.books[obj.second.pair].asks[0][0];
	} else {
		vols[2] *= book.books[obj.second.pair].bids[0][0];
	}

	if( obj.third.type == "bid"){
		vols[2] /= book.books[obj.third.pair].asks[0][0];
	}
	
	obj.first.vol = vols[0];
	obj.second.vol = vols[1];
	obj.third.vol = vols[2];

	return vols;
};	




