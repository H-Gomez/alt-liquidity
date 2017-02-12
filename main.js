/** Main file for running */

var api = require('./api.js');
var orders = require('./orderHandler.js');
var snapshot = [];
var ticker;

api.init();

setInterval(function () {
    api.ticker(function(data) {
        ticker = data;

        api.orderBook(function(data) {
            orders.sumOrders(data);
            var marketSnapshot = {};
            marketSnapshot.symbol = data.symbol;
            marketSnapshot.bidSum = data.bidSum;
            marketSnapshot.askSum = data.askSum;
            marketSnapshot.price = ticker[data.symbol]['last'];
            snapshot.push(marketSnapshot);

            api.update(snapshot, function() {
                snapshot = [];
            });
        });
    });
}, 300000);

