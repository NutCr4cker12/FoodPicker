import React, { useState, useEffect, useCallback } from 'react'
import { useCustomCompareEffect } from "use-custom-compare";

import { XYPlot, ArcSeries } from 'react-vis'
import { Paper, IconButton } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';

import { nhApi } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual'

const useStyles = makeStyles(theme => ({
    paper: theme.monitor.paper,
    floatRight: theme.monitor.floatRight,
    background: theme.monitor.lightBackground,
    labelContainer: {
        position: "absolute",
        top: "72px",
        left: "calc(50% - 80px)",
        height: "100px",
        width: "150px",
        textAlign: "center"
    },
    labelStyle: {
        lineHeight: "8px"
    },
    arcplotStyle: {
        position: "absolute"
    },
}))

const nhFoo = {
    devicesStatuses: { MINING: 2, DISABLED: 1 },
    minerStatuses: { MINING: 1 },
    miningRigs: [{
        devices: [
            { name: "cpu", deviceType: { enumName: "CPU", description: "cpu" } },
            {
                deviceType: { enumName: "NVIDIA", description: "Nvidia" },
                id: "2-GSrqi-ksfl+Woiv9mQxH-Q",
                intensity: { enumName: "LOW", description: "Low power mode" },
                load: 100,
                name: "ASUS NVIDIA GeForce RTX 2070",
                nhqm: "",
                powerMode: { enumName: "HIGH", description: "High power mode" },
                powerUsage: 121,
                revolutionsPerMinute: -1,
                revolutionsPerMinutePercentage: 73,
                speeds: [
                    {
                        algorithm: "DAGGERHASHIMOTO",
                        displaySuffix: "MH",
                        speed: "42.44745200",
                        title: "DaggerHashimoto",
                    }
                ],
                status: { enumName: "MINING", description: "Mining" },
            },
            {
                deviceType: { enumName: "NVIDIA", description: "Nvidia" },
                id: "2-GSrqi-ksfl+Woiv9mQxH-Q",
                intensity: { enumName: "LOW", description: "Low power mode" },
                load: 100,
                name: "ASUS NVIDIA GeForce RTX 3090",
                nhqm: "",
                powerMode: { enumName: "HIGH", description: "High power mode" },
                powerUsage: 270,
                revolutionsPerMinute: -1,
                revolutionsPerMinutePercentage: 73,
                speeds: [
                    {
                        algorithm: "DAGGERHASHIMOTO",
                        displaySuffix: "MH",
                        speed: "100.44745200",
                        title: "DaggerHashimoto",
                    }
                ],
                status: { enumName: "MINING", description: "Mining" },
            }
        ],
        joinTime: 1625902469,
        localProfitability: 0.0002364248037036576,
        minerStatus: "MINING",
        name: "worker1",
        profitability: 0.00019872000000000002,
        rigId: "0-UhsRoOB50F6xOsjWpruBIg",
        rigPowerMode: "HIGH",
        softwareVersions: "NHM/3.0.6.5",
        stats: [{
            algorithm: { enumName: "DAGGERHASHIMOTO", description: "DaggerHashimoto" },
            difficulty: 0.05466773208073769,
            market: "EU",
            profitability: 0.00019872000000000002,
            proxyId: 1,
            speedAccepted: 120.22248971989666,
            speedRejectedR1Target: 0.7826537381108614,
            speedRejectedR2Stale: 1.5653074762217227,
            speedRejectedR3Duplicate: 0,
            speedRejectedR4NTime: 0,
            speedRejectedR5Other: 1.5653074762217227,
            speedRejectedTotal: 3.9132686905543066,
            statsTime: 1625924868000,
            timeConnected: 1625902483796,
            unpaidAmount: "0.00001701",
            xnsub: true
        }]
    }],
    totalDevices: 2,
    totalProfitability: 0.00019872000000000002,
    totalProfitabilityLocal: 0.0002364248037036576,
    totalRigs: 1,
    unpaidAmount: "0.00001701",
}

const PI = Math.PI

const parseData = data => {
    var devices = data.miningRigs[0].devices
        .filter(x => x.deviceType.enumName !== "CPU")
        .map(x => ({
            name: x.name,
            powerUsage: x.powerUsage,
            status: x.status.description,
            speed: x.speeds
        }))

    var totalSpeed = devices.reduce((a, b) => a + b.speed.reduce((c, d) => c + Number(d.speed), 0), 0);
    return {
        status: data.devicesStatuses,
        profitabilityBTC: data.totalProfitability,
        totalSpeed: totalSpeed,
        devices: devices
    }
}

const combineDatas = (nhData, hwinfoData) => {
    if (!nhData || !nhData.devices)
        return nhData;

    if (hwinfoData && hwinfoData[0]) {
        Object.keys(hwinfoData[0])
            .forEach(x => {
                var device = nhData.devices.find(d => d.name.includes(x))
                if (device) {
                    Object.keys(hwinfoData[0][x]).forEach(n => {
                        device[n.replace("GPU", "")] = hwinfoData[0][x][n];;
                    })
                }
            })
        nhData.totalGPUPower = nhData.devices.reduce((a, b) => a + b.Power, 0);
        nhData.totalPower = nhData.totalGPUPower + hwinfoData[0].CPUPower + 50; // Constant 50 for basic PC power consumption
    }

    return nhData
}

const getColor = (value, idealMin, idealMax, absMin, absMAx) => {
    if (value <= absMin)
        return "#00ffff"; // Cyan
    if (value <= idealMin)
        return "#00dba4"; // Green-Cyan
    if (value <= idealMax)
        return "#00bd00"; // Green
    if (value <= absMAx)
        return "#FF8C00"; // Dark Orange
    return "#FF0000"; // Red
}

const GenerateData = (value, radiusStart, height, idealMin, idealMax, absMin, absMax, label) => {
    // Angle is half circle => [-pi /2, pi / 2]
    let angle = - PI * (0.5) + (value / absMax) * PI
    let color = getColor(value, idealMin, idealMax, absMin, absMax);
    return { angle0: -PI * (0.5), angle: angle, radius0: radiusStart, radius: height, color: color, label: label }
}

const CustomCompare = (prevDeps, nextDeps) => {
    // nhData = [0], hwinfoData = [1]
    if (!nextDeps[0] || !nextDeps[0].devices || !(nextDeps[1] && nextDeps[1][0]))
        return true;

    // Currentyl woudld onyl need memJuncTemp, totalGPUpower and totalSpeed
    return isEqual(prevDeps, nextDeps)
}

const NHMonitor = ({ data, setData, setCombData, hwinfoData, refresh }) => {
    const fetchNH = process.env.NODE_ENV == 'production';
    const classes = useStyles()
    const [generatedData, setGeneratedData] = useState({
        data: [],
        labels: []
    })

    const fetchData = useCallback(() => {
        if (fetchNH) {
            nhApi.get()
                .then(res => {
                    setData(parseData(res))
                    // res.deviceStatuses.INACTIVE = 2 // When offline TODO IMPLEMENT
                })
                .catch(err => {
                    console.log("NH ERROR: ", err)
                })
        } else {
            setData(parseData(nhFoo))
        }
    }, [fetchNH])

    useEffect(fetchData, [refresh])
    useCustomCompareEffect(
        () => {
            const combinedData = combineDatas(data, hwinfoData);
            console.log("Combined data: ", combinedData)
            if (!Object.keys(combinedData).length)
                return;
            setCombData(combinedData)
            setGeneratedData({
                data: [
                    combinedData.devices?.length > 1 && GenerateData(combinedData.devices[1].MemJunctTemp, 2.30, 2.75, 90, 98, 80, 102, "MemJunc"),
                    GenerateData(combinedData.totalGPUPower, 2.15, 2.25, 390, 410, 150, 500, "Power"),
                    GenerateData(combinedData.totalSpeed, 2.00, 2.10, 135, 150, 50, 160, "Speed"),
                ],
                labels: [
                    combinedData.devices.length > 1 && <div key={"MemJuncLabel"}><p className={classes.labelStyle}>Mem: {combinedData.devices[1].MemJunctTemp?.toFixed(0)} &deg;</p></div>,
                    <div key={"PowerLabel"}><p className={classes.labelStyle}>Power: {combinedData.totalSpeed?.toFixed(0)} W</p></div>,
                    <div key={"SpeedLabel"}><p className={classes.labelStyle}>Speed: {combinedData.totalSpeed?.toFixed(1)} MH/s</p></div>
                ]
            })
        },
        [data, hwinfoData],
        (prevDeps, nextDeps) => CustomCompare(prevDeps, nextDeps)
    )

    // TODO Add layouts for more spefici info per gpu!
    return (
        <>
            <Paper elevation={4} className={classes.paper} style={{ position: "relative", height: "200px" }}>
                <IconButton className={classes.floatRight} onClick={() => fetchData()}>
                    <RefreshIcon color="primary" />
                </IconButton>
                <XYPlot
                    className={classes.arcplotStyle}
                    xDomain={[-3, 3]}
                    yDomain={[-3, 3]}
                    width={300}
                    height={300}>
                    <ArcSeries
                        colorType="literal"
                        animation={{
                            damping: 9,
                            stiffness: 300
                        }}
                        radiusDomain={[0, 3]}
                        data={generatedData.data}
                        getLabel={d => d.name}
                    />
                </XYPlot>
                {<div className={classes.labelContainer}>
                    {generatedData.labels}
                </div>
                }
            </Paper>
        </>
    )
}

export default NHMonitor