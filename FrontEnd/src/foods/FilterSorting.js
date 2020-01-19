import React from 'react'

import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const useStyles = makeStyles(theme => ({
	filterSectionRoot: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
		height: 224,
		width: "325px"
	},
	buttonContainer: {
		width: "33%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		margin: theme.spacing(1)
	},
	descriptionContainer: {
		height: "40%",
		color: "rgba(0, 0, 0, 0.54)"
	},
	upperdescriptionContainer: {
		display: "flex",
		alignItems: "flex-end"
	},
	textContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	}
}));

export default ({ sort, setSort }) => {
	const classes = useStyles()

	const handleChange = (name) => {
		const value = sort[name]
		if (!value) sort[name] = 1
		else if (value > 0) sort[name] = -1
		else delete sort[name]
		setSort(sort)
	}

	const getSortDescriptionUp = name => {
		if (!sort[name] || sort[name] < 0) return null
		const icon = <ArrowUpwardIcon />
		const text = name === "Food Amount" ? "Less first" : (name === "Cooking Time" ? "Fastest first" : "Oldest first")
		return (
			<div className={classes.textContainer}>
				{icon}
				<Typography>
					{text}
				</Typography>
			</ div>
		)
	}
	
	const getSortDescriptionDown = name => {
		if (!sort[name] || sort[name] > 0) return  null
		const icon = <ArrowDownwardIcon />
		const text = name === "Food Amount" ? "Multiple first" : (name === "Cooking Time" ? "Slowest first" : "Latest first")
		return (
			<div className={classes.textContainer}>
				<Typography>
					{text}
				</Typography>
				{icon}
			</ div>
		)
	}
	

	const SortButton = (name) => {
		return (
			<div className={classes.buttonContainer}>
				<div className={`${classes.descriptionContainer} ${classes.upperdescriptionContainer}`}>
					{getSortDescriptionUp(name)}
				</div>
				<Button variant="contained" color="primary" onClick={() => handleChange(name)}>
					{name}
				</Button>
				<div className={classes.descriptionContainer}>
					{getSortDescriptionDown(name)}
				</div>
			</div>
		)
	}

	return (
		<div className={classes.filterSectionRoot}>
			{SortButton("Food Amount")}
			{SortButton("Cooking Time")}
			{SortButton("Last Eaten")}
		</div>
	)
}