/** Main file for running */

var api = require('./api.js');
var orders = require('./orderHandler.js');

var snapshot = {};
snapshot.symbol = "BTC_NXC";

setInterval(function () {
    api.orderBook(function(data) {
        orders.sumOrders(data);
        snapshot.bidSum = data.bidSum;
        snapshot.askSum = data.askSum;
    });

    api.ticker(function(data) {
        snapshot.price = data['BTC_NXC']['last'];
    });

    api.update(snapshot);
    console.log(snapshot);
}, 2000);


