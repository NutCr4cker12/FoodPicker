import React, { useState } from 'react'

import { fade, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '80%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
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
	searchDiv : {
		width: "60%"
	},
	btnDiv: {
		width: "40%"
	},
	div: {
		flexGrow: 1
	}
}))

export default ({ search, onSetSearch, children }) => {
	const classes = useStyles()
	const [searchState, setSearch] = useState(search)

	return (
		<div className={classes.center}>
			<div className={classes.searchDiv}>
			<TextField
				type="search"
				fullWidth={true}
				value={searchState}
				onChange={event => setSearch(event.target.value)}
				placeholder="Search…"
				className={classes.margin}
				InputProps={{
					startAdornment: <InputAdornment position="start">
						<SearchIcon onClick={() => {
							onSetSearch(searchState)
						}} />
					</InputAdornment>,
				}}
			/>
			</div>
			<div className={classes.btnDiv} >
			{children}
			</div>
		</div>
	)
}