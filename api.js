const WebSocket = require('ws');
const autobahn = require('autobahn');
const request = require('request');

const wsuri = "wss://api.poloniex.com";
const resturi = "https://poloniex.com/public?command=returnOrderBook&currencyPair=";
const depth = 50000;
const market = "BTC_STRAT";

const marketUrl = resturi + market + "&depth=" + depth;

function getOrderBook(callback) {
    request(marketUrl, function(error, response, body) {
       if (!error && response.statusCode == 200) {
           callback(JSON.parse(body));
       }
    });
}

module.exports = {
    orderBook: getOrderBook
};


