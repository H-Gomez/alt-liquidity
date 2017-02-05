function sumOrders(orderbook) {
    orderbook.bidSum = 0;
    orderbook.askSum = 0;

    if ("bids" in orderbook) {
        orderbook["bids"].forEach(function(bid) {
            orderbook.bidSum += bid[0] * bid[1];
        });
    }

    if ("asks" in orderbook) {
        orderbook["asks"].forEach(function(ask) {
            orderbook.askSum += ask[1];
        });
    }

    return orderbook;
}

module.exports = {
    sumOrders: sumOrders
};
