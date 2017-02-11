const request = require('request');
const azure = require('azure-storage');
const uuid = require('uuid');

const depth = 100000;
const market = "BTC_ETH";
const restUri = "https://poloniex.com/public?command=";
const tickerUrl = restUri + "returnTicker&currencyPair=" + market;
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
            //console.log(result, response);
        }
        else {
            //console.log(error);
        }
    });

    var snapshot = {
        PartitionKey: entGen.String('markets'),
        RowKey: entGen.String(uuid()),
        symbol: entGen.String(marketData.symbol),
        price: entGen.Double(marketData.price),
        bidSum: entGen.Double(marketData.bidSum),
        askSum: entGen.Double(marketData.askSum)
    };

    tableService.insertEntity('depth', snapshot, function(error, result, response) {
       if (!error) {
           console.log("Row added");
       }
    });
}

function getMarketDepth(callback) {
    var account = 'altester';
    var key = 'Tywcply3HpxJmqFXmYCDy5r+qGHspaCi3dk7AoAnhINyyx8ohAJ2T8Dv1ps3ty9fiDUUV9JmN/v4xdweZhVyFQ==';

    var tableService = azure.createTableService(account, key);


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
    getDepth: getMarketDepth
};


