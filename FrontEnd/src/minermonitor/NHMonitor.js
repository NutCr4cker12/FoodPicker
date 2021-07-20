import React, { useState, useEffect, useCallback } from 'react'
import { useCustomCompareEffect } from "use-custom-compare";

import { XYPlot, ArcSeries } from 'react-vis'
import { Paper, IconButton } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';

import { nhApi } from '../api';
import { getDateTimeDifferenceString } from '../core/combineDates';
import { makeStyles } from '@material-ui/core/styles';
import SwibeTabs from '../core/SwibeTabs';
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
    statusContainer: {
        position: "absolute",
        top: "91%",
        right: "16px"
    },
    labelStyle: {
        lineHeight: "8px"
    },
    arcplotStyle: {
        position: "absolute",
        left: "calc(50% - 170px)",
        top: "8px"
    },
    timeLabelsContainer: {
        position: "absolute",
        height: "100%",
        top: "calc(100% - 28px)"
    },
    timelabel: {
        lineHeight: "0px",
        marginTop: "4px",
        fontSize: "0.705rem",
        color: "#ffffff70"
    },
    gpuContainer: {
        display: "flex",
        justifyContent: "space-between"
    },
    gpuInnerContainer: { width: "45%" },
    gpuLabelDiv: { display: "flex", justifyContent: "space-between", height: "22px" }
}))

const nhFoo = {
    devicesStatuses: { MINING: 2, DISABLED: 1 },
    minerStatuses: { MINING: 1, STOPPED: 1 },
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
        statusTime: "1626271434009",
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
    if (data.devicesStatuses?.DISABLED)
        delete data.devicesStatuses.DISABLED

    return {
        status: data.devicesStatuses,
        profitabilityBTC: data.totalProfitability,
        totalSpeed: totalSpeed,
        devices: devices,
        time: new Date(parseInt(data.miningRigs[0].statusTime))
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

const CustomTimeLabelCompare = (prev, next) => {
    for (let index = 0; index < prev.length; index++) {
        if (prev[index] !== next[index])
            return false;
    }
    return true;
    // let prevHWTime = prev[prev.length - 1].length > 0 ? prev[prev.length - 1][0].time : null;
    // let nextHWTime = next[next.length - 1].length > 0 ? next[next.length - 1][0].time : null;
    // return prevHWTime === nextHWTime;
}

const NHMonitor = ({ data, setData, combData, setCombData, hwinfoData, refresh, setRefresh }) => {
    const fetchNH = process.env.NODE_ENV === 'production' // || true;
    const classes = useStyles()
    const [generatedData, setGeneratedData] = useState({ data: [], labels: [] })
    const [timeLabels, setTimeLabels] = useState({ hwinfo: "--", nh: "--", updateTime: false })

    const fetchData = useCallback(() => {
        let cancelled = false;
        if (fetchNH) {
            nhApi.get()
                .then(res => {
                    if (cancelled)
                        return;
                    setData(parseData(res))
                })
                .catch(err => {
                    console.log("NH ERROR: ", err)
                })
        } else {
            setData(parseData(nhFoo))
        }
        return () => {
            cancelled = true;
        }
    }, [fetchNH])

    useEffect(fetchData, [refresh])

    useCustomCompareEffect(
        () => {
            const hwinfoDataTimestamp = hwinfoData.length > 0 ? getDateTimeDifferenceString(new Date(hwinfoData[0].time)) : "--";
            const nhTimestamp = data?.time ? getDateTimeDifferenceString(data.time) : "--";
            setTimeLabels({ hwinfo: hwinfoDataTimestamp, nh: nhTimestamp, updateTime: timeLabels.updateTime })

            let timeout = setTimeout(() => {
                setTimeLabels({ ...timeLabels, updateTime: !timeLabels.updateTime })
            }, 5000)

            return () => {
                clearTimeout(timeout)
            }
        },
        [timeLabels.updateTime, data?.time, hwinfoData.length > 0 ? hwinfoData[0].time : null],
        (prev, next) => CustomTimeLabelCompare(prev, next)
    )

    useCustomCompareEffect(
        () => {
            const combinedData = combineDatas(data, hwinfoData);
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
                    <div key={"PowerLabel"}><p className={classes.labelStyle}>Power: {combinedData.totalGPUPower?.toFixed(0)} W</p></div>,
                    <div key={"SpeedLabel"}><p className={classes.labelStyle}>Speed: {combinedData.totalSpeed?.toFixed(1)} MH/s</p></div>
                ]
            })
        },
        [data, hwinfoData],
        (prevDeps, nextDeps) => CustomCompare(prevDeps, nextDeps)
    )


    const GPULabel = ({ title, value, alert }) => (
        <div className={classes.gpuLabelDiv}>
            <p className={classes.labelStyle}>{title}</p>
            <p className={classes.labelStyle} style={alert ? { color: "red" } : {}}>{value}</p>
        </div>
    )
    // Labels for GPU Panels
    const createGPULabel = (title, value, valueIsRed) => <div className={classes.gpuLabelDiv}>
        <p className={classes.labelStyle}>{title}</p>
        <p className={classes.labelStyle} style={valueIsRed ? { color: "red" } : {}}>{value}</p>
    </div>

    // Base Panel wrapper for all panels
    const PanelBase = props => (
        <Paper elevation={4} className={classes.paper} style={{ position: "relative", height: "200px", overflow: "hidden" }}>
            <IconButton className={classes.floatRight} onClick={() => setRefresh()}>
                <RefreshIcon color="primary" />
            </IconButton>
            <p style={{ marginLeft: "8px" }}>{props.title}</p>
            {props.children}
            <div className={classes.timeLabelsContainer}>
                <p className={classes.timelabel}>HWinfo: {timeLabels.hwinfo}</p>
                <p className={classes.timelabel}>NH: {timeLabels.nh}</p>
            </div>
        </Paper>
    )

    const overViewPanel = (
        <PanelBase title="OverView">
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
            </div>}
            {combData?.status && <div className={classes.statusContainer}>
                <p className={`${classes.labelStyle} ${classes.timelabel}`}>
                    {JSON.stringify(combData.status)
                        .split("{").join("")
                        .split("}").join("")
                        .split('"').join("")
                        .split(":").join(": ")
                    }
                </p>
            </div>
            }
        </PanelBase>
    )

    const gpuPanels = combData?.devices?.map(gpu => (
        <PanelBase key={gpu.name} title={gpu.name.split(" ").slice(-1)[0]}>
            <div className={classes.gpuContainer}>
                <div className={classes.gpuInnerContainer}>
                    <GPULabel title="GPU Temp: " value={<>{gpu.Temp?.toFixed(1)} &deg;</>} />
                    <GPULabel title="HotSpot: " value={<>{gpu.HotSpotTemp?.toFixed(1)} &deg;</>} />
                    {"MemJunctTemp" in gpu && <GPULabel title="MemJunc: " value={<>{gpu.MemJunctTemp?.toFixed(1)} &deg;</>} alert={gpu.MemJunctTemp > 100} />}
                    <GPULabel title="Fans: " value={<>{gpu.Fan?.toFixed(1)} %</>} alert={gpu.Fan > 94} />
                </div>
                <div className={classes.gpuInnerContainer}>
                    <GPULabel title="Power: " value={<>{gpu.Power?.toFixed(1)} W</>} />
                    <GPULabel title="Speed: " value={<>{gpu.speed?.length > 0 ? parseFloat(gpu.speed[0]?.speed).toFixed(1) : 0} MH/s</>} />
                    <GPULabel title="Algo: " value={gpu.speed?.length > 0 ? gpu.speed[0]?.title : "--"} />
                    <GPULabel title="Status: " value={gpu.status.includes("OFFLINE") ? "OFFLINE" : gpu.status} alert={gpu.status.includes("OFFLINE")} />
                </div>
            </div>
        </PanelBase>
    ))

    gpuPanels?.reverse()

    // TODO time update interval

    return <SwibeTabs hideTabs panels={gpuPanels ? [overViewPanel, ...gpuPanels] : [overViewPanel]} />
}

export default NHMonitor