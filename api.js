const request = require('request');

const depth = 50000;
const market = "BTC_NXC";
const restUri = "https://poloniex.com/public?command=";
const tickerUrl = restUri + "returnTicker&currencyPair=BTC_NXC";
const marketUrl = restUri + "returnOrderBook&currencyPair=" + market + "&depth=" + depth;

/**
 * Get the order for a given symbol from the api endpoint;
 * @param callback function
 */
function getOrderBook(callback) {
    request(marketUrl, function(error, response, body) {
       if (!error && response.statusCode == 200) {
           callback(JSON.parse(body));
       }
    });
}

/**
 * Get the ticker for a given symbol from the api endpoint.
 */
function getTicker(callback) {
    request(tickerUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body));
        }
    });
}

module.exports = {
    orderBook: getOrderBook,
    ticker: getTicker
};


