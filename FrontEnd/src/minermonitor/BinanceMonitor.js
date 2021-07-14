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
        justifyContent: "space-between"
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
    lastPrice: 28189.23000000,
    lastQty: 0.00206800,
    lowPrice: 28019.55000000,
    openPrice: 28140.19000000,
    openTime: 1625856813703,
    prevClosePrice: 28144.97000000,
    priceChange: 49.04000000,
    priceChangePercent: 0.174,
    quoteVolume: 41071006.63447189,
    symbol: "BTCEUR",
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
    lastPrice: 0.06256900,
    lastQty: 0.31900000,
    lowPrice: 0.06202100,
    openPrice: 0.06386800,
    openTime: 1625856813687,
    prevClosePrice: 0.06387300,
    priceChange: -0.00129900,
    priceChangePercent: -2.034,
    quoteVolume: 6506.87270971,
    symbol: "ETHBTC",
    volume: 103275.20500000,
    weightedAvgPrice: 0.06300518,
}]

const parseBinanceData = data => {
    let parsed = []

    let btc = data.find(x => x.symbol === "BTCEUR");
    if (btc) {
        parsed.push({
            symbol: "BTC",
            icon: 'BTC.png',
            price: parseFloat(btc.lastPrice),
            changePrice: parseFloat(btc.priceChange),
            changePercent: parseFloat(btc.priceChangePercent),
        })
    } else {
        return parsed
    }

    let eth = data.find(x => x.symbol === "ETHBTC");
    if (eth) {
        parsed.push({
            symbol: "ETH",
            icon: 'ETH.png',
            price: parseFloat(eth.lastPrice) * parseFloat(btc.lastPrice),
            changePrice: parseFloat(eth.priceChange),
            changePercent: parseFloat(eth.priceChangePercent),
        })
    }

    return parsed;
}

const BinanceMonitor = ({ refresh, data, setData }) => {
    const fetchBinance = process.env.NODE_ENV == 'production';
    const classes = useStyles()

    const fetchData = useCallback(() => {
        if (fetchBinance) {
            binanceApi.find({ symbols: ["BTCEUR", "ETHBTC"] })
                .then(res => {
                    console.log("GOT BINANCE DATA: ", res)
                    setData(parseBinanceData(res))
                })
                .catch(err => {
                    console.log("Binance ERROR: ", err)
                })
        } else {
            setData(parseBinanceData(binanceFoo))
        }
    }, [fetchBinance, setData])

    useEffect(() => {
        fetchData();
    }, [refresh])

    if (!data) {
        return <></>
    }

    return (
        <Paper elevation={4} className={classes.paper}>
            <IconButton className={classes.floatRight} onClick={() => fetchData()}>
                <RefreshIcon color="primary" />
            </IconButton>
            {data.map(x => (
                <div className={classes.horizontal} key={x.symbol}>
                    {/* <img source={`./public/${x.icon}`} alt={x.name} /> */}
                    <p className={classes.margin} >{x.symbol}</p>
                    <p className={classes.margin} >{x.price?.toFixed(0)} €</p>
                    <div style={{ display: "contents" }}>
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