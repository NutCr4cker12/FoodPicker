import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { Dialog, DialogActions, Button, OutlinedInput, DialogTitle, DialogContent, TextField, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText, FormHelperText } from '@material-ui/core';

import { setEditFood, setErrors, selectFood } from './foodAction'

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { foods } from '../api';
import { setMessage, setError } from '../App/AppActions';
import BackDialog from '../core/BackDialog'

const useStyles = makeStyles(theme => ({
	container: {
		margin: theme.spacing(1)
	},
	selectFieldContainer: {
		width: "250px",
		padding: theme.spacing(2)
	},
	selectField: {
		minWidth: "200px",
		maxWidth: "200px",
	},
	addButton: {
		minWidth: "100px",
		maxWidth: "150px",
		backgroundColor: theme.palette.common.white,
		color: theme.palette.primary.main
	},
	sideType: {
		backgroundColor: theme.palette.common.white,
	},
	center: {
		display: "flex",
		position: "relative",
		alignItems: "center"
	},
	div: {
		flexGrow: 1
	},
	dialogContainer: {
		display: "flex",
		flexDirection: "column",
		margin: "auto",
		width: "fit-content"
	}
}))

const distDayTypes = [
	{ label: "1 day", value: 1 },
	{ label: "2 days", value: 2 },
	{ label: "3 days", value: 3 },
	{ label: "4 days", value: 4 },
	{ label: "5 days", value: 5 },
]

const FoodEdit = ({ user, foodEdit, open, onSetEditFood, distMainTypes, distSideTypes, onSaveFood, onDeleteFood, errors, onUpdate }) => {
	const classes = useStyles()
	var food = Object.assign({}, foodEdit);

	const [mainType, setMainType] = useState(food.maintype)
	const [foodAmount, setFoodAmount] = useState(food.foodamount.toString())
	const [sideTypes, setSideTypes] = useState(food.sidetype)
	const [name, setName] = useState(food.name)
	const [recipe, setRecipe] = useState(food.link)
	const [eaten, setEaten] = useState(food.timeseaten)
	const [cookTime, setCookTime] = useState(food.time)
	const [deleteOpen, setDeleteOpen] = useState(false)

	const constructFood = () => {
		return {
			_id: food._id,
			name: name,
			link: recipe,
			maintype: mainType,
			sidetype: sideTypes,
			foodamount: foodAmount,
			time: cookTime,
			timeseaten: eaten
		}
	}

	const validateTime = (value) => {
		const regex = new RegExp("[^0-9]")
		if (regex.test(value)) return
		setCookTime(value)
	}

	const SelectField = ({ label, value, onChange, types }) => {
		return (
			<div className={classes.selectFieldContainer}>
				<TextField
					select
					label={label}
					fullWidth={true}
					className={classes.selectField}
					variant="outlined"
					value={value}
					onChange={e => onChange(e.target.value)}
				>
					{types.map((x, i) => (
						<MenuItem key={i} value={x.value || x}>
							{x.label || x}
						</MenuItem>
					))}
				</TextField>
			</div>
		)
	}

	const sideTypeElement = (
		<div className={classes.selectFieldContainer} >
			<FormControl className={classes.selectField} variant="outlined"
				error={errors.includes("side")}
			>
				<InputLabel className={classes.sideType}>Side Types</InputLabel>
				<Select
					multiple
					fullWidth={true}
					multiline={true}
					value={sideTypes}
					onChange={e => setSideTypes(e.target.value)}
					input={<OutlinedInput />}
					renderValue={sideTypes => sideTypes.join(", ")}
				>
					{distSideTypes.map(type => (
						<MenuItem key={type} value={type}>
							<Checkbox checked={sideTypes.includes(type)} color="primary" />
							<ListItemText primary={type} />
						</MenuItem>
					))}
				</Select>
				<FormHelperText>{errors.includes("side") ? "Must have at least one side type" : ""}</FormHelperText>
			</FormControl>
		</div>
	)

	const nameElement = (
		<div className={classes.selectFieldContainer} >
			<TextField
				variant="outlined"
				className={classes.selectField}
				label={"Name"}
				value={name}
				multiline={true}
				onChange={value => setName(value.target.value)}
				error={errors.includes("name")}
				helperText={errors.includes("name") ? "Name can't be empty" : ""}
			/>
		</div>
	)

	const speedElement = (
		<div className={classes.selectFieldContainer} >
			<TextField
				variant="outlined"
				className={classes.selectField}
				label="Cooking Time"
				value={cookTime}
				onChange={e => validateTime(e.target.value)}
				error={errors.includes("time")}
				helperText={errors.includes("time") ? "Cooking time can't be empty" : ""}
			/>
		</div>
	)

	const recipeElement = (
		<div className={classes.selectFieldContainer} >
			<TextField
				variant="outlined"
				className={classes.selectField}
				label={"Recipe"}
				value={recipe}
				multiline={!recipe.includes("http")}
				onChange={e => setRecipe(e.target.value)}
			/>
		</div>
	)

	const eatenElement = (
		<div className={classes.selectFieldContainer} >
			<TextField
				variant="outlined"
				className={classes.selectField}
				label="Times Eaten"
				value={eaten}
				onChange={e => setEaten(e.target.value)}
				disabled={user.role !== "admin"}
			/>
		</div>
	)

	const editContent = (
		<React.Fragment>
			{nameElement}
			<SelectField label={"Main Type"} value={mainType} onChange={(value) => setMainType(value)} types={distMainTypes} />
			{sideTypeElement}
			<SelectField label={"Food Amount"} value={foodAmount} onChange={(value) => setFoodAmount(value)} types={distDayTypes} />
			{speedElement}
			{recipeElement}
			{eatenElement}
		</React.Fragment>
	)

	const deleteFood = (
		<Button startIcon={<DeleteForeverIcon />} onClick={() => setDeleteOpen(true)}>
			Delete
		</Button>
	)

	return (
		<div>
			<Dialog open={open} onClose={() => onSetEditFood(null)} className={classes.container}>
				<DialogTitle>
					<div className={classes.center}>
						{name}
						<div className={classes.div} />
						{food._id ? deleteFood : null}
					</div>
				</DialogTitle>
				<DialogContent >
					<form className={classes.dialogContainer} noValidate>
						{editContent}
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => onSetEditFood(null)} color="primary">
						Cancel
          			</Button>
					<Button onClick={() => {
						onUpdate()
						onSaveFood(constructFood())
					}} color="primary" autoFocus>
						{food.id ? "Apply" : "Add"}
          				</Button>
				</DialogActions>
			</Dialog>
			<BackDialog
				open={deleteOpen}
				onCancel={() => setDeleteOpen(false)}
				onOk={() => {
					setDeleteOpen(false)
					onDeleteFood(food._id)
					onUpdate()
				}}
				title="Delete Food"
				text="Are you sure?"
				okText="Delete"
			/>
		</div>
	)
}

const mapStateToProps = (state) => {
	const d = state.food.distincts
	return {
		user: state.user,
		open: state.food.foodEditOpen,
		distMainTypes: d.main || [],
		distSideTypes: d.side || [],
		errors: state.food.errors
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSetEditFood: (food) => {
			dispatch(setEditFood(food))
			dispatch(setErrors([]))
		},
		onDeleteFood: (id) => {
			if (!id) return
			foods.remove(id)
				.then(() => {
					dispatch(setMessage("Food Deleted"))
					dispatch(setEditFood(null))
					dispatch(selectFood(null))
					dispatch(setErrors([]))
				})
				.catch(err => dispatch(setError(err.message)))
		},
		onSaveFood: (food) => {
			var errors = []
			if (!food.name) errors.push("name")
			if (!food.sidetype.length) errors.push("side")
			if (!food.time) errors.push("time")
			if (errors.length) {
				return dispatch(setErrors(errors))
			} else {
				if (food._id) {
					foods.patch(food._id, food)
						.then(() => {
							dispatch(setMessage('Food Updated'))

							dispatch(setEditFood(null))
							dispatch(setErrors([]))
						})
						.catch(err => dispatch(setError(err.message)))
				} else {
					foods.create(food)
						.then(() => {
							dispatch(setMessage('New Food Added'))
							dispatch(setEditFood(null))
							dispatch(setErrors([]))
						})
						.catch(err => dispatch(setError(err.message)))
				}
			}
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FoodEdit)