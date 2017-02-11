/** Main file for running */

var api = require('./api.js');
var orders = require('./orderHandler.js');

var snapshot = {};
snapshot.symbol = "BTC_ETH";

setInterval(function () {
    api.orderBook(function(data) {
        orders.sumOrders(data);
        snapshot.bidSum = data.bidSum;
        snapshot.askSum = data.askSum;
    });

    api.ticker(function(data) {
        snapshot.price = data['BTC_ETH']['last'];
    });
}, 50000);

setInterval(function () {
    api.update(snapshot);
}, 120000);


