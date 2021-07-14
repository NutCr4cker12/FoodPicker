const fetch = require('node-fetch')
const { BadRequest } = require('@feathersjs/errors')

const get24hChange = symbol => {
    return fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=" + symbol, {
        method: "GET",
    }).then(res => res.json())
}

exports.Binance = class Binance {
    constructor() {

    }

    find(params) {
        // fetch("https://api.binance.com/api/v3/exchangeInfo") // TODO Implement exchangeInfo get
        const symbols = params.query.symbols;
        if (!symbols || !Array.isArray(symbols) || symbols.length > 5)
            return BadRequest();

        return Promise.all(symbols.map(get24hChange))
    }
};
