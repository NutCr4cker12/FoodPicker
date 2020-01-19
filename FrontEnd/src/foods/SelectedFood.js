import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Dialog, DialogActions, TextField, Button, DialogTitle, DialogContent, IconButton, Table, TableRow, TableCell, TableBody, Link, TableHead, Typography } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { selectFood, setEditFood } from './foodAction'

import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import TodayIcon from '@material-ui/icons/Today';
import CheckIcon from '@material-ui/icons/Check';
import { foods } from '../api';
import { setMessage, setError } from '../App/AppActions';

const useStyles = makeStyles(theme => ({
	spread: theme.spreadDivColumn,
	centerColumns: theme.centerDivColumn,
	container: {
		margin: theme.spacing(1)
	},
	margin: {
		margin: theme.spacing(3)
	},
	selectFieldContainer: {
		width: "250px",
		padding: theme.spacing(2)
	},
	selectField: {
		minWidth: "200px",
		maxWidth: "200px",
	},
	datePickerTextfield: {
		width: "110px"
	},
	button: {
		width: "180px",
		height: "60px"
	}
}))


const toFineTime = (time) => {
	const today = new Date()
	const diff = Math.round((today - time) / (24 * 60 * 60 * 1000))
	var ago;
	if (diff > 356) {
		ago = "Over a Year ago"
	} else if (diff > 30) {
		const m = Math.round(diff / 30)
		ago = `${m} month${m > 1 ? "s" : ""} ago`
	} else if (diff > 7) {
		const w = Math.round(diff / 7)
		ago = `${w} week${w > 1 ? "s" : ""} ago`
	} else if (diff === 0) {
		ago = "today"
	} else if (diff === -1) {
		ago = "tomorrow"
	} else if (diff < -1) {
		ago = `in ${diff * (-1)} days`
	}
	return `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} - ${ago}`
}

const getLatestFoodInfo = food => {
	var lastDate = new Date(food.lasteaten.sort((a, b) => new Date(b) - new Date(a))[0])
	if (lastDate < new Date()) lastDate = new Date()
	const startDate = new Date(lastDate.valueOf() + 24 * 60 * 60 * 1000)
	const endDate = new Date(startDate.valueOf() + food.foodamount * 24 * 60 * 60 * 1000)
	return {
		startDate: startDate,
		endDate: endDate
	}
}

const SelectedFood = ({ food, latestFood, onSelectFood, onSetEditFood, onUpdate, onFoodSelection }) => {
	const classes = useStyles()
	const latestFoodInfo = getLatestFoodInfo(latestFood)
	const [startDate, setStartDate] = useState(latestFoodInfo.startDate)
	const [endDate, setEndDate] = useState(latestFoodInfo.endDate)

	if (!food) return null;

	const handleSelect = () => {
		var days = [startDate.toDateString()]
		var currDay = startDate
		while (true) {
			var newDay = new Date(currDay.valueOf() + 24 * 60 * 60 * 1000)
			if (newDay > endDate) break
			days.push(newDay.toDateString())
			currDay = newDay
		}
		if (!food.lasteaten) food.lasteaten = [];
		food.lasteaten = food.lasteaten.concat(days)
		food.timeseaten = food.timeseaten + 1
		onFoodSelection(food)
		onUpdate()
	}


	const historyContent = (
		<div className={classes.selectFieldContainer} >
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>History</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{food.lasteaten ? food.lasteaten.reverse().slice(0, 10).map((f, i) => (
						<TableRow key={i}>
							<TableCell>
								{toFineTime(new Date(f))}
							</TableCell>
						</TableRow>
					)) : <TableRow><TableCell>No recordings</TableCell></TableRow>}
				</TableBody>
			</Table>
		</div>
	)

	const selectContent = (
		<div className={classes.centerColumns}>
			<div>
				{food.link.includes("http") || food.link.includes("www") ?
					<Typography>
						<Link href={food.link}>
							Link To Recipe
					</Link>
					</Typography>
					: null}
			</div>
			<div className={classes.spread}>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<DatePicker
						label="Date"
						format="DD.MM.YYYY"
						views={["year", "month", "date"]}
						minDate={new Date(2020, 0, 1)}
						showTodayButton={true}
						value={startDate}
						onChange={date => setStartDate(date._d)}
						animateYearScrolling
						TextFieldComponent={(props) => (
							<TextField
								label="Start Date"
								onClick={props.onClick}
								value={props.value}
								InputProps={{
									startAdornment: <TodayIcon />
								}}
								size="small"
								className={`${classes.datePickerTextfield} ${classes.margin}`}
							/>
						)}
					/>
					<DatePicker
						label="Date"
						format="DD.MM.YYYY"
						views={["year", "month", "date"]}
						minDate={new Date(2020, 0, 1)}
						showTodayButton={true}
						value={endDate}
						onChange={date => setEndDate(date._d)}
						animateYearScrolling
						TextFieldComponent={(props) => (
							<TextField
								label="End Date"
								onClick={props.onClick}
								value={props.value}
								InputProps={{
									startAdornment: <TodayIcon />
								}}
								size="small"
								className={`${classes.datePickerTextfield} ${classes.margin}`}
							/>
						)}
					/>
				</MuiPickersUtilsProvider>
			</div>
			<Button
				startIcon={<CheckIcon />}
				variant="contained"
				color="primary"
				className={classes.button}
				onClick={handleSelect}
			>Select Food</Button>
			{historyContent}
		</div>
	)

	return (
		<div>
			<Dialog open={true} onClose={() => onSelectFood(null)} className={classes.container}>
				<DialogTitle >
					<div className={classes.spread}>
						{food.name}
						<IconButton onClick={() => onSetEditFood(food)}>
							<EditIcon />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent>
					{selectContent}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => onSelectFood(null)} color="primary">
						Cancel
          			</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		food: state.food.selectedFood,
		latestFood: state.food.latestFood,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSelectFood: (food) => {
			dispatch(selectFood(food))
		},
		onSetEditFood: (food) => {
			dispatch(setEditFood(food))
		},
		onFoodSelection: (food) => {
			foods.patch(food._id, food)
				.then(res => {
					dispatch(setMessage(`Going to eat ${food.name}`))
					dispatch(selectFood(null))
				})
				.catch(err => {
					dispatch(setError(err.message))
				})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedFood)