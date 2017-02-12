const request = require('request');
const azure = require('azure-storage');
const uuid = require('uuid');

const depth = 100000;
const markets = ['BTC_ETH', 'BTC_ETC', 'BTC_MAID', 'BTC_STRAT', 'BTC_XMR', 'BTC_NXC'];
const restUri = "https://poloniex.com/public?command=";
const tickerUrl = restUri + "returnTicker";
const marketUrl = restUri + "returnOrderBook&currencyPair=";

const account = 'altester';
const key = 'Tywcply3HpxJmqFXmYCDy5r+qGHspaCi3dk7AoAnhINyyx8ohAJ2T8Dv1ps3ty9fiDUUV9JmN/v4xdweZhVyFQ==';
const tableService = azure.createTableService(account, key);

/**
 * Get the order for a given symbol from the api endpoint;
 * @param callback function
 */
function getOrderBook(callback) {
    markets.forEach(function(market) {
        var requestUrl = marketUrl + market + "&depth=" + depth;

        request(requestUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var orderBook = {};
                orderBook.orders = JSON.parse(body);
                orderBook.symbol = market;
                callback(orderBook);
            } else {
                console.log(error);
            }
        });
    });
}

/**
 * Get the ticker for a given symbol from the api endpoint.
 */
function getTicker(callback) {
    request(tickerUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body));
        } else {
            console.log(error);
        }
    });
}

/**
 * Checks the data store for existing tables and creates a new one per market
 * if required.
 */
function prepareTables() {
    markets.forEach(function(market) {
        var tableName = market.replace(/_/g, "");
        tableService.createTableIfNotExists(tableName, function(error, result, response) {
            if (error) {
                console.log(error);
            } else if (response.statusCode == 204) {
                console.log("Created new table: " + tableName);
            } else if (response.statusCode == 200) {
                console.log("Table already exists: " + tableName);
            }
            else {
                console.log(response);
            }
        });
    });
}

/**
 * Pushes the market data, in a snapshot form to Azure.
 * @param marketSnapshot
 * @param callback
 */
function pushMarketSnapshot(marketSnapshot, callback) {
    var entGen = azure.TableUtilities.entityGenerator;

    marketSnapshot.forEach(function(market) {
        var tableName = market.symbol.replace(/_/g, "");
        var snapshot = {
            PartitionKey: entGen.String(market.symbol),
            RowKey: entGen.String(uuid()),
            price: entGen.Double(market.price),
            bidSum: entGen.Double(market.bidSum),
            askSum: entGen.Double(market.askSum)
        };

        tableService.insertEntity(tableName, snapshot, function(error, result, response) {
            if (!error) {
                console.log("Market snapshot added successfully");
            } else {
                console.log(error);
            }
        });
    });

    callback();
}

/**
 * Builds a query used to get the data from Azure
 * @param callback
 */
function getMarketDepth(callback) {
    var query = new azure.TableQuery()
        .select(['price, bidSum, askSum, Timestamp'])
        .top(10)
        .where('PartitionKey eq ?', 'markets');

    tableService.queryEntities('depth', query, null, function(error, result, response) {
        if (!error) {
            callback((response.body.value));
        }
    });
}

module.exports = {
    orderBook: getOrderBook,
    ticker: getTicker,
    update: pushMarketSnapshot,
    getDepth: getMarketDepth,
    init: prepareTables
};


