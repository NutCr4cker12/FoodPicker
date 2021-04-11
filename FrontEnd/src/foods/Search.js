import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import { boldSearch } from '../core/BoldSearch'

import SearchIcon from '@material-ui/icons/Search';

import { connect } from 'react-redux'
import { setOptions } from './foodAction'
import { foods } from '../api'

const useStyles = makeStyles(theme => ({
	margin: {
		margin: theme.spacing(1),
		maxWidth: "300px"
	},
	center: {
		display: "flex",
		position: "relative",
		alignItems: "center",
		width: "100%"
	},
	searchDiv: {
		width: "60%"
	},
	btnDiv: {
		width: "40%"
	},
	div: {
		flexGrow: 1
	},
	padding: {
		padding: theme.spacing(2)
	}
}))

function Search(props) {
	const classes = useStyles()
	const { search, onSelectFood, options, onSetOptions } = props
	const [searchState, setSearchState] = useState(search)

	const setSearch = search => {
		setSearchState(search)
		onSetOptions(search)
	}

	return (
		<Box display="block" justifyContent="center" className={classes.padding}>
			<Autocomplete
				options={options}
				getOptionLabel={option => option.name}
				renderOption={option => boldSearch(option.name, searchState)}
				renderInput={params => {
					var { InputProps, ...rest } = params;
					InputProps.startAdornment = (
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment >)
					return (
						<TextField
							{...rest}
							placeholder="Search..."
							variant="outlined"
							value={searchState}
							fullWidth
							onChange={e => setSearch(e.target.value)}
							InputProps={InputProps}
						/>
					)
				}}
				onChange={(e, value) => {
					onSelectFood(value)
				}}
			/>
			</ Box>
	)
}

const mapStateToProps = (state) => {
	return {
		options: state.food.searchOptions
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSetOptions: search => {
			if (!search.length)
				return dispatch(setOptions([]))
			const query = { $regex: search }
			foods.find(query)
				.then(res => {
					dispatch(setOptions(res.data))
				})
				.catch(err => {
					console.log(err)
				})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)