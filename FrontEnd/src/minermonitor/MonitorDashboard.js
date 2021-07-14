import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button';

import { hwinfoApi, nhApi } from '../api';
import { makeStyles } from '@material-ui/core/styles';

import BinanceMonitor from './BinanceMonitor';
import NHMonitor from './NHMonitor';
import ProfitabilityMonitor from './ProfitabilityMonitor';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(1),
        width: "100%",
        height: "100vh"
    },
    background: theme.monitor.background
}))

const MinerMonitor = props => {
    const [state, setState] = useState({
        refresh: false,
    })
    const [hwinfoData, setHWinfoData] = useState([])
    const [binanceData, setBinanceData] = useState([])
    const [nhData, setNHData] = useState({ data: {}, combinedData: {}})
    const classes = useStyles()

    // TODO avg of the fee's -> reduce from profitability
    // TODO create nice default one-clance view with "openable" cards (HWINFO)

    useEffect(() => {
        hwinfoApi.list({ $limit: 1, $sort: { "time": -1 } })
            .then(res => 
                setHWinfoData(res.data)
            )
            .catch(err => {
                console.log(err)
            })

    }, [state.refresh])

    console.log("Dastboard nhData: ", nhData)

    return (
        <div className={`${classes.root} ${classes.background}`}>
            <Button variant="contained" color="primary" onClick={() => setState({ ...state, dummyRefresh: !state.dummyRefresh })}>Refresh</Button>
            <NHMonitor refresh={state.refresh} data={nhData.data} combData={nhData.combinedData} setData={data => setNHData({ ...nhData, data: data})} setCombData={data => setNHData({ ...nhData, combinedData: data})} hwinfoData={hwinfoData} />
            <ProfitabilityMonitor nhData={nhData.combinedData} binanceData={binanceData} />
            <BinanceMonitor refresh={state.refresh} data={binanceData} setData={data => setBinanceData(data)} />
        </div >
    )
}

export default MinerMonitor