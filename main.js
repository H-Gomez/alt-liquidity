/** Main file for running */

var api = require('./api.js');
var orders = require('./orderHandler.js');

api.orderBook( function(data) {
    orders.sumOrders(data);
    console.log(data);
});
