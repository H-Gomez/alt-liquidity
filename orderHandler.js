var api = require('./api.js');

function sumOrders() {
    var orderbook = api.orderBook();

    var bidSum = 0;
    var askSum = 0;

    orderbook.bids.forEach(function(bid) {
        bidSum += bid[0] * bid[1];
    });

    orderbook.asks.forEach(function(ask) {
        askSum += ask[1];
    });

    console.log('Bids: ' + bidSum.toFixed(4) + ' BTC');
    console.log('Asks: ' + askSum.toFixed(4) + ' XMR');
}

sumOrders();
