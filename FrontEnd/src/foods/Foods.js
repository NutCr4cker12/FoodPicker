import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { foods } from '../api'
import Filters from './Filters'
import Search from './Search'
import Table from '../core/Table'
import FoodEdit from './foodEdit'
import SelectedFood from './SelectedFood'

import { connect } from 'react-redux'
import { setFilters, selectFood, setFoods, onSetOpenFilters, distincts, setEditFood, setLatestFood } from './foodAction'
import { setError } from '../App/AppActions';

const useStyles = makeStyles(theme => ({
	root: theme.root,
}))

const columns = ["Main", "Side", "Food", "Count", "LastEaten", "Cooking Time", "Food Amount"]

const defaultFood = {
	name: "Name",
	maintype: "liha",
	sidetype: ["pasta"],
	foodamount: 1,
	link: "",
	time: 60,
	timeseaten: 0
}

const Foods = ({ foods, sort, onSelectFood, onRefresh, filters, search, setOpenFilter, page, limit, selectedFood, foodEdit, initFilters, onSetEditFood }) => {
	const classes = useStyles()

	if (!foods.limit) {  // Init fetching
		initFilters()
		onRefresh(page, filters, sort, search, limit)
	}


	return (
		<Paper className={classes.root}>
			<Search search={search} onSelectFood={onSelectFood} />
			<Filters
				setOpenFilter={setOpenFilter}
				currentFilters={filters}
				currentSort={sort}
				onApply={(f, s) => onRefresh(page, f, s, search, limit)}
				clearFilters={() => initFilters()}
			/>
			<Table
				columns={columns}
				data={foods}
				sort={sort}
				limit={limit}
				setSort={sort => onRefresh(page, filters, sort, search, limit)}
				setLimit={limit => onRefresh(page, filters, sort, search, limit)}
				onSelectFood={onSelectFood}
				onAddFood={() => onSetEditFood(defaultFood)}
				setOpenFilter={setOpenFilter}
				page={page}
				setPage={p => onRefresh(p, filters, sort, search, limit)}
			/>
			{selectedFood ? <SelectedFood onUpdate={() => onRefresh(page, filters, sort, search, limit)} /> : null}
			{foodEdit ? <FoodEdit foodEdit={foodEdit} onUpdate={() => onRefresh(page, filters, sort, search, limit)} /> : null}
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
		limit: state.food.limit,
		selectedFood: state.food.selectedFood,
		foodEdit: state.food.foodEdit,
	}
}



const mapDispatchToProps = (dispatch) => {
	return {
		onSelectFood: (food) => {
			dispatch(selectFood(food))
		},
		onRefresh: (page, filters, sort, search, limit) => {
			foods.list(filters, page, sort, search, limit)
				.then(result => {
					dispatch(setFoods({
						foods: result,
						filters: filters,
						sort: sort,
						page: page,
						limit: limit,
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