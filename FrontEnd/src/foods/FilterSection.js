import React, { useState } from 'react'

import { connect } from 'react-redux'
import { Tabs, Tab, Button, Slider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TabContent from '../core/TabContent'

const useStyles = makeStyles(theme => ({
	filterSectionRoot: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
		height: 224,
		// marginLeft: "-20px"
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
		backgroundColor: theme.palette.primary,
	},
	verticalTab: {
		alignItems: "start",
		maxWidth: "10px"
	},
	center: {
		display: "flex",
		position: "relative",
		alignItems: "center"
	},
	tabContainer: {
		flexGrow: 1,
		maxWidth: "250px",
		marginLeft: "-56px",
		marginTop: "-40px",
		paddingTop: "2px"
	},
	speedContainer: {
		minWidth: "200px",
		marginLeft: "5px"
	},
	speedText: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	speedBtn: {
		display: "flex",
		alignItems: "center",
		margin: "10px"
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	filterButton: {
		width: "80px",
		fontSize: "small"
	},
	filterButtonDisabled: {
		width: "80px",
		fontSize: "small",
		color: "#d3d3d3"
	},
	header: {
		width: "80px",
		fontSize: "small",
		opacity: 1,
		// border: `1px solid ${theme.palette.primary.main}`,
		// color: theme.palette.primary.main
	},
	filterTab: {
		minWidth: "80px"
	},
}));

const getSpeedLabel = (value) => {
	const hours = Math.floor(value / 60)
	const mins = Math.floor((value % 60) / 6);
	if (mins === 0) return hours
	return `${hours}.${mins}`
}

const getSpeedText = (value) => {
	const hours = Math.floor(value / 60)
	const mins = Math.floor(value % 60);
	if (hours === 0) return `    ${mins} min`
	if (mins === 0) return `${hours} h       `
	return `${hours}h ${mins} min`
}

const inSpread = 2;
const outSpread = 12;
const gridSpacing = 3;

const FilterSection = ({ filters, setFilters }) => {
	const classes = useStyles()
	const [tabValue, setTabValue] = useState(0)

	const onFilterClick = (f) => {
		var selected;
		if (f in filters.main) selected = filters.main
		else if (f in filters.side) selected = filters.side
		else if (f in filters.day) selected = filters.day
		const newValue = selected[f] === "$in" ? "$nin" : "$in"
		selected[f] = newValue
		setFilters(filters)
	}
	
	const forceColumn = (type, filter) => {
		const first = Object.keys(type.type)[0]

		var selected;
		if (first in filters.main) selected = filters.main
		else if (first in filters.side) selected = filters.side
		else if (first in filters.day) selected = filters.day

		Object.keys(selected).forEach(f => {
			selected[f] = filter
		})
		setFilters(filters)
	}

	const GridHeader = (type) => (
		<React.Fragment>
			<Grid item xs={inSpread}>
				<Button color="primary" className={classes.header} onClick={() => forceColumn(type, "$in")}>Include</Button>
			</Grid>
			<Grid item xs={inSpread}>
				<Button color="primary" className={classes.header} onClick={() => forceColumn(type, "$nin")}>Exclude</Button>
			</Grid>
		</React.Fragment>
	)

	const onOffBtn = (on, label, onClick) => (
		<Button
			variant={on ? "contained" : "outlined"}
			color={on ? "primary" : "default"}
			onClick={() => onClick(label)}
			className={on ? classes.filterButton : classes.filterButtonDisabled}
		>{label}</Button>
	)

	const buttonFilters = (type) => {
		const arr = Object.keys(type)
		return (
			<div className={classes.tabContainer}>
				<Grid container spacing={1} directon="row" justify="space-evenly" alignItems="flex-start">
					<Grid container item xs={outSpread} spacing={gridSpacing}>
						<GridHeader type={type} />
					</Grid>
					{arr.map(f => {
						const left = type[f] === "$in"
						return (
							<React.Fragment key={f}>
								<Grid container item xs={outSpread} spacing={gridSpacing} >
									<Grid item xs={inSpread} >
										{onOffBtn(left, f, onFilterClick)}
									</Grid>
									<Grid item xs={inSpread} >
										{onOffBtn(!left, f, onFilterClick)}
									</Grid>
								</Grid>
							</React.Fragment>
						)
					})}
				</Grid>
			</div>
		)
	}

	const mainContent = buttonFilters(filters.main)
	const sideContent = buttonFilters(filters.side)
	const dayContent = buttonFilters(filters.day)

	const speedFilter = Object.keys(filters.speed)[0]
	const speedValue = filters.speed[speedFilter]
	const timeIsLess = speedFilter === "$lt"
	const speedFilterText = timeIsLess ? "less" : "more";

	const handleSpeedClick = (value) => {
		filters.speed = timeIsLess ? {"$gt": speedValue} : {"$lt": speedValue}
		setFilters(filters)
	}

	const speedContent = (
		<div className={classes.speedContainer}>
			<div className={classes.speedBtn}>
				{onOffBtn(timeIsLess, "<", handleSpeedClick)}
				{onOffBtn(!timeIsLess, ">", handleSpeedClick)}
			</div>
			<Slider
				value={speedValue}
				defaultValue={180}
				track={timeIsLess ? "normal" : "inverted"}
				getAriaValueText={value => `${value}`}
				valueLabelDisplay="auto"
				valueLabelFormat={value => getSpeedLabel(value)}
				onChange={(e, value) => {
					if (value !== speedValue) {
						filters.speed[speedFilter] = value
						setFilters(filters)
					}
				}}
				step={30}
				min={0}
				max={180}
			/>
			{/* <Typography id="discrete-slider-restrict" gutterBottom> */}
				<div className={classes.speedText}>
					<div>{`Takes ${speedFilterText} than `}</div>
					<div>{`${getSpeedText(speedValue)}`}</div>
					<div>{` to make`}</div>
				</div>
			{/* </Typography> */}
		</div>
	);
	
	return (
		<div className={classes.filterSectionRoot}>
			<Tabs
				orientation="vertical"
				className={classes.tabs}
				indicatorColor="primary"
				textColor="primary"
				value={tabValue}
				onChange={(e, value) => setTabValue(value)}
			>
				<Tab label="Main" className={classes.filterTab} />
				<Tab label="Side" className={classes.filterTab} />
				<Tab label="Speed" className={classes.filterTab} />
				<Tab label="Day" className={classes.filterTab} />
			</Tabs>
			<TabContent value={tabValue} index={0} >
				{mainContent}
			</TabContent>
			<TabContent value={tabValue} index={1} >
				{sideContent}
			</TabContent>
			<TabContent value={tabValue} index={2} >
				{speedContent}
			</TabContent>
			<TabContent value={tabValue} index={3} >
				{dayContent}
			</TabContent>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterSection)