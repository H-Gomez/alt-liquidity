function sumOrders(orderbook) {
    orderbook.bidSum = 0;
    orderbook.askSum = 0;
    var bidSum = 0;
    var askSum = 0;

    orderbook.bids.forEach(function(bid) {
        orderbook.bidSum += bid[0] * bid[1];
    });

    orderbook.asks.forEach(function(ask) {
        orderbook.askSum += ask[1];
    });

    return orderbook;

}

module.exports = {
    sumOrders: sumOrders
};
