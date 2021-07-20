import React, { useEffect, useCallback } from 'react'

import { Paper, IconButton } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import RefreshIcon from '@material-ui/icons/Refresh';

import { binanceApi } from '../api';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    paper: theme.monitor.paper,
    floatRight: theme.monitor.floatRight,
    horizontal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "85%"
    },
    margin: {
        margin: theme.spacing(1),
    },
    up: {
        color: "green"
    },
    down: {
        color: "red"
    }
}))

const binanceFoo = [{
    askPrice: 28194.14000000,
    askQty: 0.00071100,
    bidPrice: 28190.56000000,
    bidQty: 0.01496000,
    closeTime: 1625943213703,
    count: 57461,
    firstId: 56346219,
    highPrice: 28873.33000000,
    lastId: 56403679,
    lastPrice: "29755.55000000",
    lastQty: 0.00206800,
    lowPrice: 28019.55000000,
    openPrice: 28140.19000000,
    openTime: 1625856813703,
    prevClosePrice: 28144.97000000,
    priceChange: "-1488.48000000",
    priceChangePercent: "-4.764",
    quoteVolume: 41071006.63447189,
    symbol: "BTCUSDT",
    volume: 1443.29207600,
    weightedAvgPrice: 28456.47621672,
},
{
    askPrice: 0.06256900,
    askQty: 32.42100000,
    bidPrice: 0.06256800,
    bidQty: 0.32000000,
    closeTime: 1625943213687,
    count: 146086,
    firstId: 282229466,
    highPrice: 0.06410600,
    lastId: 282375551,
    lastPrice: "1749.66000000",
    lastQty: 0.31900000,
    lowPrice: 0.06202100,
    openPrice: 0.06386800,
    openTime: 1625856813687,
    prevClosePrice: 0.06387300,
    priceChange: "-122.63000000",
    priceChangePercent: "-6.550",
    quoteVolume: 6506.87270971,
    symbol: "ETHUSDT",
    volume: 103275.20500000,
    weightedAvgPrice: 0.06300518,
}]

const parseBinanceData = (data, symbols) => {
    let parsed = []

    symbols.forEach(symbol => {
        let s = data.find(x => x.symbol === symbol);
        if (s) {
            parsed.push({
                symbol: symbol.slice(0, 3),
                icon: `${symbol.slice(0, 3)}.png`,
                price: parseFloat(s.lastPrice),
                changePrice: parseFloat(s.priceChange),
                changePercent: parseFloat(s.priceChangePercent),
            })
        }
    })

    return parsed;
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT"]

const BinanceMonitor = ({ refresh, data, setData }) => {
    const fetchBinance = process.env.NODE_ENV === 'production' // || true;
    const classes = useStyles()

    const fetchData = useCallback(() => {
        if (fetchBinance) {
            binanceApi.find({ symbols: SYMBOLS })
                .then(res => {
                    setData(parseBinanceData(res, SYMBOLS))
                })
                .catch(err => {
                    console.log("Binance ERROR: ", err)
                })
        } else {
            setData(parseBinanceData(binanceFoo, SYMBOLS))
        }
    }, [fetchBinance, setData])

    useEffect(() => {
        fetchData();
    }, [refresh])

    return (
        <Paper elevation={4} className={classes.paper} >
            <IconButton className={classes.floatRight} onClick={() => fetchData()}>
                <RefreshIcon color="primary" />
            </IconButton>
            {data.map(x => (
                <div className={classes.horizontal} key={x.symbol}>
                    <img source={`./build/${x.icon}`} alt={x.name} style={{ height: "50px", width: "50px" }} />
                    <p className={classes.margin} style={{ width: "28px"}} >{x.symbol}</p>
                    <p className={classes.margin} style={{ width: "252x"}} >$ {x.price?.toFixed(0)}</p>
                    <div style={{ display: "contents", width: "66px" }}>
                        <p className={classes.margin}>{x.changePercent?.toFixed(1)} %</p>
                        {x.changePrice > 0 ?
                            <ArrowDropUpIcon className={classes.up} /> :
                            <ArrowDropDownIcon className={classes.down} />
                        }
                    </div>
                </div>
            ))}
        </Paper>
    )
}

export default BinanceMonitor