const request = require('request');
const azure = require('azure-storage');

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

function pushMarketSnapshot(marketData, callback) {
    var entGen = azure.TableUtilities.entityGenerator;

    var account = 'altester';
    var key = 'Tywcply3HpxJmqFXmYCDy5r+qGHspaCi3dk7AoAnhINyyx8ohAJ2T8Dv1ps3ty9fiDUUV9JmN/v4xdweZhVyFQ==';

    var tableService = azure.createTableService(account, key);

    tableService.createTableIfNotExists('depth', function(error, result, response) {
        if (!error){
            console.log(result, response);
        }
        else {
            console.log(error);
        }
    });

    var snapshot = {
        PartitionKey: entGen.String('markets'),
        RowKey: entGen.String('1'),
        symbol: entGen.String(marketData.symbol),
        price: entGen.Double(marketData.price),
        bidSum: entGen.Double(marketData.bidSum),
        askSum: entGen.Double(marketData.askSum)
    }

    tableService.insertEntity('depth', snapshot, function(error, result, response) {
       if (!error) {
           console.log(result, response);
       }
    });
}

module.exports = {
    orderBook: getOrderBook,
    ticker: getTicker,
    update: pushMarketSnapshot
};


