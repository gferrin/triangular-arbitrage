/*-------------------------------------------------------
    :: BTC-E Book
    -> Gabriel Ferrin & Connor Black 
    
    Order book for BTCE 
--------------------------------------------------------*/

/*-- Dependencies --*/

var events = require('events');
var request = require('request');
var colors = require('colors');

var config = require("../config/config_books");

/*-- Object declaration --*/

var Book = function (pair) {
    self = this;
    self.bids = [];
    self.asks = [];
    self.bid = 0;
    self.ask = 0;
    self.last_updated = 0;
    self.pair = pair;
};

Book.prototype.__proto__ = events.EventEmitter.prototype;

/*-- Object functions --*/

Book.prototype._make_depth_request = function (callback) {
    request({
          url: config.BTCE_URL + this.pair + '/depth'
    }, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            callback(new Error(err ? err : response.statusCode));
            return;
        }

        var result = JSON.parse(body);

        if (result.error) {
            callback(new Error(result.error));
            return;
        }

        callback(null, result);
    });
};

Book.prototype._refresh = function(){
    var self = this;

    self._make_depth_request( function( err, res ){
        if(err === null){
            self._proccess_new_book(res);
        } else {
            console.log("Error in btce book depth".red);
        }
    });
};

Book.prototype._proccess_new_book = function (book) {
    var self = this;

    self.bids = book.bids;
    self.asks = book.asks;

    // *** MAKE SURE these are correct ***
    self.bid = self.bids[0][0];
    self.ask = self.asks[0][0];

    self.last_updated = Math.round(new Date().getTime() / 1000);

    console.log('Book updated: ' + this.pair);
};

Book.prototype.update_book = function (update) {
    this._refresh();
};

Book.prototype.update_inside = function(bid, ask){
    var self = this;

    self.bid = bid;
    self.ask = ask;
};

module.exports = Book;