###
    :: Book Object
      - Holds list of all currency books 
        and includes helper functions.

    -> Connor Black & Gabriel Ferrin
###

# Dependancies

events = require ('events')
btce_book = require ('./btce_book')
colors = require('colors')
pairs = require('../config/btce_pairs')

# Object instantiation

# btce = require('../clients/btc_e').connect()

BTCE = require('btc-e')
fs = require('fs')
#currentNonce = fs.existsSync("nonce.json") ? JSON.parse(fs.readFileSync("nonce.json")) : 0

currentNonce = 0
# Book class

module.exports = class Book extends events.EventEmitter

  constructor: ->
    @books = {} 
    for pair, value of pairs 
      @books[pair] = new btce_book(value)
  
  update: (pair, callback) ->
    @books[pair].update_book()
    @emit 'update_'+pair

  update_all: (callback)->
    for own book, value of @books
      @books[book].update_book()

    @emit 'update_all' 
    console.log 'Updating books...'.yellow

  get_inside: (pair, callback) ->
    inside =
      bid: @books[pair].bid
      ask: @books[pair].ask

    @emit 'get_inside'
    return inside

  get_inside_all: () ->
    inside_list = {}
    inside_array = []
    for own book, value of @books
      inside = @get_inside(book)
      inside_list[book.toString()] = inside

    @emit 'get_inside_all'
    return inside_list

  trade: (pair, action, rate, volume) ->

    btce = new BTCE("FIJDJ7UB-AOXVJQH8-SFB2MQGO-9C59H8VE-L8Y1SJNO", "994dde581b6cac4be71b890b22048f55fb779214007ff53041a5f0620a71c3ff",
      ()-> 
        currentNonce++
        fs.writeFile("nonce.json", currentNonce)
        return currentNonce
      
      # ()->
      #   currentNonce++
      #   fs.writeFile("nonce.json", currentNonce)
      #   return currentNonce
    )
    # if rate and volume are not defined take them from current book
    if (action is 'bid')
      # if not rate?
      #   rate = @books[pair].ask
      # if not volume?
      #   volume = @books[pair].asks[0][1]


    else if (action is 'ask')
      # if not rate?
      #   rate = @books[pair].bid
      # if not volume?
      #   volume = @books[pair].bids[0][1]

      btce.trade(pair, 'sell', rate, volume, 
        (err, res)->
          if err 
            console.log err 
          else
            console.log res
      )
    else
      console.log 'Error in Books.trade'

    # @emit 'trade'
    # Not sure if we want to update all books
    # @update_all()

    # or just the book we traded in 
    @update(pair)
