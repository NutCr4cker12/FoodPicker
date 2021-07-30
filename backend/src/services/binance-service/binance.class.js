const fetch = require('node-fetch')
const { BadRequest } = require('@feathersjs/errors')

const tryGetFloat = s => {
    let res = parseFloat(s[0].replace("<", "").replace(">", ""))
    if (Number.isNaN(res))
        return ZEROUSDEUR;
    return { symbol: "USDEUR", value: res };
}

const ZEROUSDEUR = { symbol: "USDEUR", value: 0 }
const getUSDEUR = () => {
    return new Promise(resolve => {
        fetch("https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=EUR", {
            method: "GET"
        })
            .then(res => res.text())
            .then(t => {
                const resultPattern = /((US Dollar =<\/p>)\B).*(> Euros)/
                let resultString = resultPattern.exec(t);
                if (!resultString)
                    resolve(ZEROUSDEUR);

                resultString = resultString[0]
                const numberPattern = />[\d.]+</g
                const numberMatches = [...resultString.matchAll(numberPattern)];
                const numMatches = numberMatches.length
                if (!numMatches)
                    resolve(ZEROUSDEUR);

                if (numMatches === 1) {
                    resolve(tryGetFloat(numberMatches[0]))
                }

                const num = tryGetFloat(numberMatches[0]);
                const fraction = parseFloat("0.00" + tryGetFloat(numberMatches[1]).toString());
                const value = num + fraction
                resolve({ symbol: "USDEUR", value: value});
            })
            .catch(err => {
                console.log(err)
                resolve(ZEROUSDEUR);
            })
    })
}

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

        const promises = symbols.filter(x => x !== "USDEUR").map(get24hChange)
        const usdEurSymbol = symbols.filter(x => x === "USDEUR")
        if (usdEurSymbol)
            promises.push(getUSDEUR())


        return Promise.all(promises)
    }
};
