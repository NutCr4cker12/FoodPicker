import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';

import { hwinfoApi } from '../api';
import { makeStyles } from '@material-ui/core/styles';

import BinanceMonitor from './BinanceMonitor';
import NHMonitor from './NHMonitor';
import ProfitabilityMonitor from './ProfitabilityMonitor';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100vh"
    },
    background: theme.monitor.background,
    refreshButtonContainer: {
        display: "flex",
        justifyContent: "center"
    }
}))

const MinerMonitor = props => {
    const [state, setState] = useState({
        refresh: false,
    })
    const [hwinfoData, setHWinfoData] = useState([])
    const [binanceData, setBinanceData] = useState([])
    const [nhData, setNHData] = useState({ data: {}, combinedData: {} })
    const classes = useStyles()

    // TODO avg of the fee's -> reduce from profitability

    useEffect(() => {
        hwinfoApi.list({ $limit: 1, $sort: { "time": -1 } })
            .then(res => setHWinfoData(res.data))
            .catch(err => {
                console.log(err)
            })

    }, [state.refresh])

    return (
        <div className={`${classes.root} ${classes.background}`}>
            <NHMonitor
                refresh={state.refresh}
                setRefresh={() => setState({ refresh: !state.refresh })}
                data={nhData.data}
                combData={nhData.combinedData}
                setData={data => setNHData({ ...nhData, data: data })}
                setCombData={data => setNHData({ ...nhData, combinedData: data })}
                hwinfoData={hwinfoData}
            />
            <ProfitabilityMonitor
                nhData={nhData.combinedData}
                binanceData={binanceData}
            />
            <BinanceMonitor
                refresh={state.refresh}
                data={binanceData}
                setData={data => setBinanceData(data)}
            />
            <div className={classes.refreshButtonContainer}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={() => setState({ ...state, refresh: !state.refresh })}
                >
                    Refresh
                </Button>
            </div>
        </div >
    )
}

export default MinerMonitor