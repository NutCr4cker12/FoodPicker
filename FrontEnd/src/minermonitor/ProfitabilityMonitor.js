import React, { useState } from 'react'
import { useCustomCompareEffect } from "use-custom-compare";

import { Paper, Button, TextField } from '@material-ui/core'
import FlashOnIcon from '@material-ui/icons/FlashOn';
import FlashOffIcon from '@material-ui/icons/FlashOff';
import SwibeTabs from '../core/SwibeTabs';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        ...theme.monitor.paper,
        marginTop: "0px",
        marginBottom: "0px"
    },
    profitabilityContainer: {
        textAlign: "center"
    },
    profitabilityProjectorContainer: {
        display: "flex",
        justifyContent: "space-around"
    },
    labelStyle: {
        lineHeight: "8px"
    },
    profitLabelStyle: {
        color: "#00bd00",
        fontSize: "18px"
    },
    centered: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    tabRoot: {
        visibility: "collapse",
        minHeight: "0px",
        height: "0px"
    },
    whiteLabel: {
        color: theme.monitor.paper.color
    }
}))

const tryGetBinancePrice = binanceData => binanceData.find(x => x.symbol === "BTC")?.price

const CustomCompare = (prevDeps, nextDeps) => {
    // False triggers, True doesn't

    // Cannot produce the data
    if (Number.isNaN(nextDeps[2]?.profitabilityBTC) || Number.isNaN(nextDeps[2]?.totalPower) || !Array.isArray(nextDeps[3]))
        return true;

    // Cannot produce the data
    const nextPrice = tryGetBinancePrice(nextDeps[3])
    if (!Boolean(nextPrice))
        return true;

    const prevPrice = tryGetBinancePrice(prevDeps[3])

    return prevDeps[0] === nextDeps[0] &&                                       // do negate power cost
        prevDeps[1] === nextDeps[1] &&                                          // powerCost amount
        prevDeps[2]?.profitabilityBTC === nextDeps[2].profitabilityBTC &&       // nhData profitability
        prevDeps[2]?.totalPower === nextDeps[2].totalPower &&                   // nhData power
        prevPrice === nextPrice                                                 // BTC price
}

const calculateProfitability = (profitPerDay, powerConsumptionWH, negatePower, powerCost) => {
    const powerkWday = (powerConsumptionWH / 1000.0) * 24
    const powerCostDaily = powerkWday * powerCost;
    const dailyProfit = profitPerDay - (negatePower ? powerCostDaily : 0);
    return {
        profitabilityEUR: dailyProfit,
        profitabilityWeek: dailyProfit * 7,
        profitabilityMonth: dailyProfit * 365 / 12.0,
        profitabilityYear: dailyProfit * 365,
        powerCostPercentage: (powerCostDaily / profitPerDay) * 100
    }
}

const ProfitabilityMonitor = ({ nhData, binanceData }) => {
    const classes = useStyles()
    const [negatePowerCost, setNegatePowerCost] = useState(true)
    const [powerCost, setPowerCost] = useState(0.158)
    const [profits, setProfits] = useState({})

    useCustomCompareEffect(
        () => {
            setProfits(
                calculateProfitability(
                    nhData.profitabilityBTC * tryGetBinancePrice(binanceData),
                    nhData.totalPower,
                    negatePowerCost,
                    powerCost
                )
            )
        },
        [negatePowerCost, powerCost, nhData, binanceData],
        (prevDeps, nextDeps) => CustomCompare(prevDeps, nextDeps)
    );

    const P = props => <p className={classes.labelStyle} {...props}>{props.children}</p>
    const P2 = props => <p className={`${classes.labelStyle} ${classes.profitLabelStyle}`}>{props.children} €</p>

    const profitPercentage = profits?.powerCostPercentage;
    const profitabilityPanel = (
        <Paper elevation={4} className={classes.paper} >
            <Button
                style={{ float: "right", width: "100px", marginLeft: "-100px" }}
                className={classes.whiteLabel}
                onClick={() => setNegatePowerCost(!negatePowerCost)}
                startIcon={negatePowerCost ? <FlashOnIcon style={{ color: "yellow" }} /> : <FlashOffIcon />}
            >
                {!Number.isFinite(profitPercentage) ? "--" : profitPercentage.toFixed(0)} %
            </Button>
            <div className={classes.profitabilityContainer}>
                <div style={{ dispaly: "flex", justifyContent: "center", alignItems: "center" }}>
                    <P style={{ marginRight: "-8px" }}>Daily profit: </P>
                    <P2 > {profits.profitabilityEUR?.toFixed(2)}</P2>
                </div>
                <div className={classes.profitabilityProjectorContainer}>
                    <div>
                        <P>Week</P>
                        <P2 >{profits.profitabilityWeek?.toFixed(0)}</P2>
                    </div>
                    <div>
                        <P>Month</P>
                        <P2>{profits.profitabilityMonth?.toFixed(0)}</P2>
                    </div>
                    <div>
                        <P>Year</P>
                        <P2>{profits.profitabilityYear?.toFixed(0)}</P2>
                    </div>
                </div>
            </div>
        </Paper>
    )

    const changePowerCostPanel = (
        <Paper elevation={4} className={`${classes.paper} ${classes.centered}`} style={{ height: "148px" }}>
            <TextField
                label={<><FlashOnIcon style={{ color: "yellow" }} />Power Cost per kW/h</>}
                type="number"
                value={powerCost}
                className={classes.powerCostLabel}
                onChange={e => setPowerCost(e.target.value)}
                InputLabelProps={{ className: `${classes.whiteLabel} ${classes.centered}` }}
                InputProps={{ className: classes.whiteLabel, style: { textAlign: "right" } }}
            />
        </ Paper>
    )

    return (
        <SwibeTabs hideTabs panels={[profitabilityPanel, changePowerCostPanel]} />
    )
}

export default ProfitabilityMonitor