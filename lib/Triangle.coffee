colors = require 'colors'
events = require 'events'

BTCE_E_FEE = 0.002 # 0.2%

module.exports = class Test extends events.EventEmitter

  usd_btc_rur: (book)->
    pair1 = 'usd'
    pair2 = 'btc'
    pair3 = 'rur'

    # USD to BTC (buying BTC)
    end = (1/book.books.btc_usd.ask) - ((1/book.books.btc_usd.ask) * BTCE_E_FEE)
    # BTC to RUR (selling BTC)
    end *= (book.books.btc_rur.bid) - ((book.books.btc_rur.bid) * BTCE_E_FEE)
    # RUR to USD (buying USD)
    end /= (book.books.usd_rur.ask) - ((book.books.usd_rur.ask) * BTCE_E_FEE)

    if end > 1
      console.log('Arbitrage:'+' usd_btc_rur'.green )
      console.log('Points: '.green + end.toString().green)
      return true
    else
      console.log('No arbirtrage:'+' usd_btc_rur')
      console.log('Points: ' + end.toString().red)
      return false


  usd_btc_eur: (book)->
    pair1 = 'usd'
    pair2 = 'btc'
    pair3 = 'eur'

    # USD to BTC (buying BTC)
    end = (1/book.books.btc_usd.ask) - ((1/book.books.btc_usd.ask) * BTCE_E_FEE)
    # BTC to EUR (selling BTC)
    end *= (book.books.btc_eur.bid) - ((book.books.btc_eur.bid) * BTCE_E_FEE)
    # EUR to USD (Selling EUR)
    end *= (book.books.eur_usd.bid) - ((book.books.eur_usd.bid) * BTCE_E_FEE)

    if end > 1
      console.log('Arbitrage: usd_btc_eur'.green )
      console.log('Points: '.green + end.toString().green)
      return true
    else
      console.log('No arbitrage: usd_btc_eur' )
      console.log('Points: ' + end.toString().red)
      return false

  usd_btc_ltc: (book)->
    pair1 = 'usd'
    pair2 = 'btc'
    pair3 = 'ltc'

    # USD to BTC (buying BTC)
    end = (1/book.books.btc_usd.ask) - ((1/book.books.btc_usd.ask) * BTCE_E_FEE)
    # BTC to LTC (buying LTC)
    end /= (book.books.ltc_btc.ask) - ((book.books.ltc_btc.ask) * BTCE_E_FEE)
    # LTC to USD (selling USD)
    end *= (book.books.ltc_usd.bid) - ((book.books.ltc_usd.bid) * BTCE_E_FEE)

    if end > 1
      console.log('Arbitrage: usd_btc_ltc'.green )
      console.log('Points: '.green + end.toString().green)
      return true
    else
      console.log('No arbitrage: usd_btc_ltc' )
      console.log('Points: ' + end.toString().red)
      return false

  usd_rur_btc: (book)->
    pair1 = 'usd'
    pair2 = 'rur'
    pair3 = 'btc'

    # USD to RUR (selling USD)
    end = (1*book.books.usd_rur.bid) - ((1*book.books.usd_rur.bid) * BTCE_E_FEE)
    # RUR to BTC (buying BTC)
    end /= (book.books.btc_rur.ask) - ((book.books.btc_rur.ask) * BTCE_E_FEE)
    # BTC to USD (selling BTC)
    end *= (book.books.btc_usd.bid) - ((book.books.btc_usd.bid) * BTCE_E_FEE)

    if end > 1
      console.log('Arbitrage: usd_rur_btc'.green )
      console.log('Points: '.green + end.toString().green)
      return true
    else
      console.log('No arbitrage: usd_rur_btc' )
      console.log('Points: ' + end.toString().red)
      return false

  usd_rur_ltc: (book)->
    pair1 = 'usd'
    pair2 = 'rur'
    pair3 = 'ltc'

    # USD to RUR (selling USD)
    end = (1*book.books.usd_rur.bid) - ((1*book.books.usd_rur.bid) * BTCE_E_FEE)
    # RUR to LTC (buying LTC) 
    end /= (book.books.ltc_rur.ask) - ((book.books.ltc_rur.ask) * BTCE_E_FEE)
    # LTC to USD (selling USD)
    end *= (book.books.ltc_usd.bid) - ((book.books.ltc_usd.bid) * BTCE_E_FEE)

    if end > 1
      console.log('Arbitrage: usd_rur_ltc'.green )
      console.log('Points: '.green + end.toString().green)
      return true
    else
      console.log('No arbitrage: usd_rur_ltc' )
      console.log('Points: ' + end.toString().red)
      return false

  usd_eur_btc: (book)->
    pair1 = 'usd'
    pair2 = 'eur'
    pair3 = 'btc'

    # USD to EUR (buying euro)
    end = (1/book.books.eur_usd.ask) - ((1/book.books.eur_usd.ask) * BTCE_E_FEE)
    # EUR to BTC (buying BTC)
    end /= (book.books.btc_eur.ask) - ((book.books.btc_eur.ask) * BTCE_E_FEE)
    # BTC to USD (selling BTC)
    end *= (book.books.btc_usd.bid) - ((book.books.btc_usd.bid) * BTCE_E_FEE)

    if end > 1
      console.log('Arbitrage: usd_eur_btc'.green )
      console.log('Points: '.green + end.toString().green)
      return true
    else
      console.log('No arbitrage: usd_eur_btc' )
      console.log('Points: ' + end.toString().red)
      return false

  usd_ltc_btc: (book)->
    pair1 = 'usd'
    pair2 = 'ltc'
    pair3 = 'btc'

    # USD to LTC (buying LTC)
    end = (1/book.books.ltc_usd.ask) - ((1/book.books.ltc_usd.ask) * BTCE_E_FEE)
    # LTC to BTC (selling LTC)
    end *= (book.books.ltc_btc.bid) - ((book.books.ltc_btc.bid) * BTCE_E_FEE)
    # BTC to USD (selling BTC)
    end *= (book.books.btc_usd.bid) - ((book.books.btc_usd.bid) * BTCE_E_FEE)

    if end > 1
      console.log('Arbitrage: usd_ltc_btc'.green )
      console.log('Points: '.green + end.toString().green)
      return true
    else
      console.log('No arbitrage: usd_ltc_btc' )
      console.log('Points: ' + end.toString().red)
      return false

  usd_ltc_rur: (book)->
    pair1 = 'usd'
    pair2 = 'ltc'
    pair3 = 'rur'

    # USD to LTC (buying LTC)
    end = (1/book.books.ltc_usd.ask) - ((1/book.books.ltc_usd.ask) * BTCE_E_FEE)
    # LTC to RUR (selling LTC)
    end *= (book.books.ltc_rur.bid) - ((book.books.ltc_rur.bid) * BTCE_E_FEE)
    # RUR to USD (buying USD)
    end /= (book.books.usd_rur.ask) - ((book.books.usd_rur.ask) * BTCE_E_FEE)

    if end > 1
      console.log('Arbitrage: usd_ltc_rur'.green )
      console.log('Points: '.green + end.toString().green)
      return true
    else
      console.log('No arbitrage: usd_ltc_rur' )
      console.log('Points: ' + end.toString().red)
      return false

  find_volume: (book, pair1, pair2, pair3) ->
    insides = 
      one: 
        type: ''
        volume: 0
        base_price: 0
        price: 0
      two:
        type: ''
        volume: 0
        base_price: 0
        price: 0
      thr:
        type: ''
        volume: 0
        base_price: 0
        price: 0
      low:
        type: ''
        volume: 0
        base_price: 0
        price: 0

    console.log '- Volumes: '+pair1+' '+pair2+' '+pair3+' -' 
    # Finds the correct first volume, price, type
    if book.books[pair1+'_'+pair2]?
      insides.one.type = 'ask'
      insides.one.volume = book.books[pair1+'_'+pair2].bids[0][1]
      insides.one.price = insides.one.volume * book.books[pair1+'_'+pair2].bids[0][0]
      console.log 'One - ' + 'Volume: '.yellow+ insides.one.volume.toString()+ ' Price: '.green+insides.one.price.toString()
    else
      insides.one.type = 'bid'
      insides.one.volume = book.books[pair2+'_'+pair1].asks[0][1]
      insides.one.price = insides.one.volume * book.books[pair2+'_'+pair1].asks[0][0]
      console.log 'One - ' +'Volume: '.yellow+ insides.one.volume.toString()+ ' Price: '.green+insides.one.price.toString()

    # Finds the correct second volume, price, type
    if book.books[pair2+'_'+pair3]?
      insides.two.type = 'ask'
      insides.two.volume = book.books[pair2+'_'+pair3].bids[0][1]
      insides.two.price = insides.two.volume * book.books[pair2+'_'+pair3].bids[0][0]
      console.log 'Two - '+ 'Volume: '.yellow+ insides.two.volume.toString()+ ' Price: '.green+insides.two.price.toString()
    else
      insides.two.type = 'bid'
      insides.two.volume = book.books[pair3+'_'+pair2].asks[0][1]
      insides.two.price = insides.two.volume * book.books[pair3+'_'+pair2].asks[0][0]
      console.log 'Two - '+ 'Volume: '.yellow+ insides.two.volume.toString()+ ' Price: '.green+insides.two.price.toString()
      
    # Finds the correct third volume, price, type
    if book.books[pair3+'_'+pair1]?
      insides.thr.type = 'ask'
      insides.thr.volume = book.books[pair3+'_'+pair1].bids[0][1]
      insides.thr.price = insides.thr.volume * book.books[pair3+'_'+pair1].bids[0][0]
      console.log 'Thr - '+'Volume: '.yellow+ insides.thr.volume.toString()+ ' Price: '.green+insides.thr.price.toString()
    else
      insides.thr.type = 'bid'
      insides.thr.volume = book.books[pair1+'_'+pair3].asks[0][1]
      insides.thr.price = insides.thr.volume * book.books[pair1+'_'+pair3].asks[0][0]
      console.log 'Thr - '+'Volume: '.yellow+ insides.thr.volume.toString()+ ' Price: '.green+insides.thr.price.toString()

    trades = @find_lowest_volume(book, insides, pair1, pair2, pair3)
    return trades
 
  find_lowest_volume: (book, insides, pair1, pair2, pair3) ->

    volumes =
      one: 0
      two: 0
      thr: 0

    if insides.one.type is 'bid'
      volumes.one = book.books[pair2+'_'+pair1].asks[0][1] * book.books[pair2+'_'+pair1].asks[0][0]
      console.log '1'
    else
      volumes.one = book.books[pair1+'_'+pair2].bids[0][1]
      console.log '2'

    if insides.two.type is 'bid'
      volumes.two = book.books[pair3+'_'+pair2].asks[0][1]
      console.log '1'
    else
      volumes.two = book.books[pair2+'_'+pair3].bids[0][1] * book.books[pair2+'_'+pair3].bids[0][0] 
      console.log '2'
      
    if insides.thr.type is 'bid'
      volumes.thr = book.books[pair1+'_'+pair3].asks[0][1]
      volumes.two /= book.books[pair1+'_'+pair3].asks[0][0]
      console.log '1'
    else
      volumes.thr = book.books[pair3+'_'+pair1].bids[0][1] * book.books[pair3+'_'+pair1].bids[0][0]
      volumes.two *= book.books[pair3+'_'+pair1].bids[0][0]
      console.log '2'

    lowest = Math.min(volumes.one, volumes.two, volumes.thr) 
    console.log lowest

    volumes.one = lowest
    volumes.two = lowest
    volumes.thr = lowest

    trades =
      one:
        volume: 0
        price: 0
      two:
        volume: 0
        price: 0
      thr: 
        volume: 0
        price: 0

    if insides.one.type is 'bid'
      volumes.one /= book.books[pair2+'_'+pair1].asks[0][0]
      trades.one.volume = volumes.one
      trades.one.price = book.books[pair2+'_'+pair1].asks[0][0]

      volumes.two /= book.books[pair2+'_'+pair1].asks[0][0]

      volumes.thr /= book.books[pair2+'_'+pair1].asks[0][0]

    else
      trades.one.volume = volumes.one
      trades.one.price = book.books[pair1+'_'+pair2].bids[0][0]

      volumes.two *= book.books[pair1+'_'+pair2].bids[0][0]

      volumes.thr *= book.books[pair1+'_'+pair2].bids[0][0]

    if insides.two.type is 'bid'
      volumes.two /= book.books[pair3+'_'+pair2].asks[0][0]

      trades.two.volume = volumes.two
      trades.two.price = book.books[pair3+'_'+pair2].asks[0][0]

      volumes.thr /= book.books[pair3+'_'+pair2].asks[0][0]
    else

      trades.two.volume = volumes.two
      trades.two.price = book.books[pair2+'_'+pair3].bids[0][0]

      volumes.thr *= book.books[pair2+'_'+pair3].bids[0][0]

    if insides.thr.type is 'bid'
      volumes.thr /= book.books[pair1+'_'+pair3].asks[0][0]

      trades.thr.volume = volumes.thr
      trades.thr.price = book.books[pair1+'_'+pair3].asks[0][0]
    else
      trades.thr.volume = volumes.thr
      trades.thr.price = book.books[pair3+'_'+pair1].bids[0][0]

    console.log volumes
    console.log trades
    return trades