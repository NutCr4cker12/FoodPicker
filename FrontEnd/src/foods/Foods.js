import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { foods } from '../api'
import Filters from './Filters'
import Search from './Search'
import Table from '../core/Table'
import FoodEdit from './foodEdit'
import SelectedFood from './SelectedFood'

import { Button } from '@material-ui/core';

import { connect } from 'react-redux'
import { setFilters, selectFood, setFoods, onSetOpenFilters, distincts, setEditFood, setLatestFood } from './foodAction'
import { setError } from '../App/AppActions';

import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
	root: theme.root,
	button: {
		marginRight: theme.spacing(2),
		marginLeft: theme.spacing(2),
		minWidth: "133px",
		// maxHeight: "36px"
	}
}))

const columns = ["Main", "Side", "Food", "Count"]

const defaultFood = {
	name: "Name",
	maintype: "liha",
	sidetype: ["pasta"],
	foodamount: 1,
	link: "",
	time: 60,
	timeseaten: 0
}

const Foods = ({ foods, sort, onSelectFood, onRefresh, filters, search, setOpenFilter, page, selectedFood, foodEdit, initFilters, onSetEditFood }) => {
	const classes = useStyles()

	if (!foods.limit) {  // Init fetching
		initFilters()
		onRefresh(page, filters, sort, search)
	}


	return (
		<Paper className={classes.root}>
			<Search search={search} onSetSearch={s => onRefresh(page, filters, sort, s)} >
				<Button
					variant="contained"
					onClick={() => onSetEditFood(defaultFood)}
					startIcon={<AddIcon />}
					color="primary"
					className={classes.button}
				>
					Add Food
			</Button>
			</Search>
			<Filters
				setOpenFilter={setOpenFilter}
				currentFilters={filters}
				currentSort={sort}
				onApply={(f, s) => onRefresh(page, f, s, search)}
				clearFilters={() => initFilters()}
			/>
			<Table
				columns={columns}
				data={foods}
				sort={sort}
				setSort={sort => onRefresh(page, filters, sort, search)}
				onSelectFood={onSelectFood}
				setOpenFilter={setOpenFilter}
				page={page}
				setPage={p => onRefresh(p, filters, sort, search)}
			/>
			{selectedFood ? <SelectedFood onUpdate={() => onRefresh(page, filters, sort, search)} /> : null}
			{foodEdit ? <FoodEdit foodEdit={foodEdit} onUpdate={() => onRefresh(page, filters, sort, search)} /> : null}
		</Paper>
	)
}

///////////////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state) => {
	return {
		user: state.user,
		foods: state.food.foods,
		sort: state.food.sort,
		filters: state.food.filters,
		search: state.food.search,
		page: state.food.page,
		selectedFood: state.food.selectedFood,
		foodEdit: state.food.foodEdit,
	}
}



const mapDispatchToProps = (dispatch) => {
	return {
		onSelectFood: (food) => {
			dispatch(selectFood(food))
		},
		onRefresh: (page, filters, sort, search) => {
			foods.list(filters, page, sort, search)
				.then(result => {
					dispatch(setFoods({
						foods: result,
						filters: filters,
						sort: sort,
						page: page,
						search: search
					}))
					foods.lastEaten()
						.then(res => {
							dispatch(setLatestFood(res))
						})
				})
				.catch(err => dispatch(setError(err.message)))
		},
		setOpenFilter: () => {
			dispatch(onSetOpenFilters())
		},
		initFilters: () => {
			var filters = {
				main: {},
				side: {},
				speed: {$lt: 180},
				day: {}
			}
			foods.distincts()
				.then(res => {
					dispatch(distincts(res))
					res.main.forEach(m => {
						filters.main[m] = "$in"
					})
					res.side.forEach(s => {
						filters.side[s] = "$in"
					})
					res.day.forEach(d => {
						filters.day[d] = "$in"
					})
					dispatch(setFilters(filters))
				})
				.catch(err => setError(err.message))
		},
		onSetEditFood: (food) => {
			dispatch(setEditFood(food))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Foods)