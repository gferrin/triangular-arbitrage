require('coffee-script');
var colors = require('colors');
var book = require('./book/Books');

var Book = new book();

var triangle = require('./lib/Triangle');
var Triangle = new triangle();
var pairs = require('./config/btce_pairs');
var btce = require('./clients/btc_e');

Book.update_all();


setTimeout(function(){

	setInterval(function(){
		
		console.log('Checking for Arbitrage...'.yellow)

		if(Triangle.usd_btc_rur(Book)){
			Book.update('btc_usd');
			Book.update('btc_rur');
			Book.update('usd_rur');
			trades = Triangle.find_volume(Book, 'usd', 'btc', 'rur');

			Book.trade('btc_usd', 'bid', trades.one.price, trades.one.volume);
			Book.update('btc_usd');

			Book.trade('btc_rur', 'ask', trades.two.price, trades.two.volume);
			Book.update('btc_rur');

			Book.trade('usd_rur', 'bid', trades.thr.price, trades.thr.volume);
			Book.update('usd_rur');

			//Triangle.emit('first');
		}
		// else
		// 	Triangle.emit('first');

		//Triangle.on('first', function(){
			if(Triangle.usd_btc_eur(Book)){
				Book.update('btc_usd');
				Book.update('btc_eur');
				Book.update('eur_usd');

				trades = Triangle.find_volume(Book, 'usd', 'btc', 'eur');

				Book.trade('btc_usd', 'bid', trades.one.price, trades.one.volume);
				Book.update('btc_usd');

				Book.trade('btc_eur', 'ask', trades.two.price, trades.two.volume);
				Book.update('btc_eur');

				Book.trade('eur_usd', 'ask', trades.thr.price, trades.thr.volume);
				Book.update('eur_usd');

				//Triangle.emit('second');
			}
		// 	else
		// 		Triangle.emit('second');
		// });
			
		//Triangle.on('second', function(){
			if(Triangle.usd_btc_ltc(Book)){
				Book.update('btc_usd');
				Book.update('ltc_btc');
				Book.update('ltc_usd');

				trades = Triangle.find_volume(Book, 'usd', 'btc', 'ltc');

				Book.trade('btc_usd', 'bid', trades.one.price, trades.one.volume);
				Book.update('btc_usd');

				Book.trade('ltc_btc', 'bid', trades.two.price, trades.two.volume);
				Book.update('ltc_btc');

				Book.trade('ltc_usd', 'ask', trades.thr.price, trades.thr.volume);
				Book.update('ltc_usd');

				//Triangle.emit('third');
			}
		// 	else
		// 		Triangle.emit('third');
		// });

		//Triangle.on('third', function(){
			if(Triangle.usd_rur_btc(Book)){
				Book.update('usd_rur');
				Book.update('btc_rur');
				Book.update('btc_usd');

				trades = Triangle.find_volume(Book, 'usd', 'rur', 'btc');

				Book.trade('usd_rur', 'ask', trades.one.price, trades.one.volume);
				Book.update('usd_rur');

				Book.trade('btc_rur', 'bid', trades.two.price, trades.two.volume);
				Book.update('btc_rur');

				Book.trade('btc_usd', 'ask', trades.thr.price, trades.thr.volume);
				Book.update('btc_usd');

				//Triangle.emit('fourth');
			}
		// 	else
		// 		Triangle.emit('fourth');
		// });

		//Triangle.on('fourth', function(){
			if(Triangle.usd_rur_ltc(Book)){
				Book.update('usd_rur');
				Book.update('ltc_rur');
				Book.update('ltc_usd');

				trades = Triangle.find_volume(Book, 'usd', 'rur', 'ltc');

				Book.trade('usd_rur', 'ask', trades.one.price, trades.one.volume);
				Book.update('usd_rur');

				Book.trade('ltc_rur', 'bid', trades.two.price, trades.two.volume);
				Book.update('ltc_rur');

				Book.trade('ltc_usd', 'ask', trades.thr.price, trades.thr.volume);
				Book.update('ltc_usd');

				//Triangle.emit('fifth');
			}
		// 	else
		// 		Triangle.emit('fifth');
		// });


		//Triangle.on('fifth', function(){
			if(Triangle.usd_eur_btc(Book)){
				Book.update('eur_usd');
				Book.update('btc_eur');
				Book.update('btc_usd');

				trades = Triangle.find_volume(Book, 'usd', 'eur', 'btc');

				Book.on('update_'+pair, function(){
					Book.trade('eur_usd', 'bid', trades.one.price, trades.one.volume);
				});

				Book.on('update_'+pair, function(){
					Book.trade('btc_eur', 'bid', trades.two.price, trades.two.volume);
				});

				Book.on('update_'+pair, function(){
					Book.trade('btc_usd', 'ask', trades.thr.price, trades.thr.volume);
				});
				
				// Book.update('eur_usd');				
				// Book.update('btc_eur');
				// Book.update('btc_usd');
				//Triangle.emit('sixth');
			}
		// 	else
		// 		Triangle.emit('sixth');
		// });

		//Triangle.on('sixth', function(){
			if(Triangle.usd_ltc_btc(Book)){
				Book.update('ltc_usd');
				Book.update('ltc_btc');
				Book.update('btc_usd');

				trades = Triangle.find_volume(Book, 'usd', 'ltc', 'btc');

				Book.trade('ltc_usd', 'bid', trades.one.price, trades.one.volume);
				Book.update('ltc_usd');

				Book.trade('ltc_btc', 'ask', trades.two.price, trades.two.volume);
				Book.update('ltc_btc');

				Book.trade('btc_usd', 'ask', trades.thr.price, trades.thr.volume);
				Book.update('btc_usd');

				//Triangle.emit('seventh');
			}
		// 	else
		// 		Triangle.emit('seventh');
		// });

		//Triangle.on('sixth', function(){
			if(Triangle.usd_ltc_rur(Book)){
				Book.update('ltc_usd');
				Book.update('ltc_rur');
				Book.update('usd_rur');

				trades = Triangle.find_volume(Book, 'usd', 'ltc', 'rur');

				Book.trade('ltc_usd', 'bid', trades.one.price, trades.one.volume);
				Book.update('ltc_usd');

				Book.trade('ltc_rur', 'ask', trades.two.price, trades.two.volume);
				Book.update('ltc_rur');

				Book.trade('usd_rur', 'bid', trades.thr.price, trades.thr.volume);
				Book.update('usd_rur');
			}
		// });

		for( var pair in pairs){
			// update the inside values for all of the pairs
			btce.ticker( pair, function(err, res){
				if( err === null ){
					Book.books[pair].update_inside(res.ticker.sell, res.ticker.buy);	
				} else {
					console.log(err);
				}
			});
		}
		// Book.update_all();

	}, 2000);

}, 5000);
	