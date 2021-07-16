import React from 'react';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import combineDates from './combineDates';

const useStyles = makeStyles(theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === 'light'
			? {
				color: theme.palette.secondary.main,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark,
			},
	title: {
		flex: '1 1 100%',
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
	button: {
		marginRight: theme.spacing(2),
		marginLeft: theme.spacing(2),
		minWidth: "133px",
	}
}));

const MyTable = (props) => {
	const classes = useStyles();
	const { columns, data, sort, setSort, limit, setLimit, onSelectFood, onAddFood, page, setPage, setOpenFilter } = props;
	if (!data) return (
		<div />
	)

	const foods = data.data
	const count = data.total || 0;
	const pager = count === 0 ? 0 : page;

	const handleChange = (name) => {
		const value = sort[name]
		if (!value) sort[name] = 1
		else if (value > 0) sort[name] = -1
		else delete sort[name]
		setSort(sort)
	}

	const tableToolbar = (
		<Toolbar >
			<Typography className={classes.title} variant="h6" id="tableTitle">
				Foods
		  		</Typography>
			<Tooltip title="Add New Food">
				<Button
					variant="contained"
					onClick={onAddFood}
					startIcon={<AddIcon />}
					color="primary"
					className={classes.button}
					size="small" >
					Add Food
				</Button>
			</Tooltip>
			<Tooltip title="Filter list">
				<Button
					variant="contained"
					color="primary"
					endIcon={<FilterListIcon />}
					size="small"
					className={classes.button}
					onClick={() => { setOpenFilter() }}>
					Filter
					</Button>
			</Tooltip>
		</Toolbar>
	)

	const getSortDirection = name => {
		const value = sort[name]
		if (!value) return false;
		if (value > 0) return "asc"
		return "desc"
	}

	const tableHeaders = (
		<TableHead>
			<TableRow>
				{columns.map((name, i) => (
					<TableCell key={i}
						className={classes.root}
						align={"left"}
						padding="none"
						sortDirection={getSortDirection(name)}
					>
						<TableSortLabel
							active={Boolean(sort[name])}
							direction={getSortDirection(name) || "asc"}
							onClick={(e) => {
								e.preventDefault()
								handleChange(name)
							}}
						>
							{name}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)

	const tableBody = (
		<TableBody>
			{foods.map((d, i) => (
				<TableRow
					key={i}
					hover
					onClick={(e) => {
						e.preventDefault()
						onSelectFood(d)
					}}
				>
					<TableCell>
						{d.maintype}
					</TableCell>
					<TableCell>
						{d.sidetype.join(", ")}
					</TableCell>
					<TableCell>
						{d.name}
					</TableCell>
					<TableCell>
						{d.timeseaten}
					</TableCell>
					<TableCell>
						{d.lasteaten && d.lasteaten.length ? 
						combineDates(d.lasteaten.map(x => new Date(x)), 1)[0].split(" - ")[0]
						: ""}
					</TableCell>
					<TableCell>
						{d.time}
					</TableCell>
					<TableCell>
						{d.foodamount}
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	)

	return (
		<div>
			{tableToolbar}
			<TableContainer>
				<Table size={'medium'} >
					{tableHeaders}
					{tableBody}
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={count}
				rowsPerPage={limit}
				onChangeRowsPerPage={e => setLimit(e.target.value)}
				rowsPerPageOptions={[10,20,40,50]}
				page={pager}
				onChangePage={(e, newPage) => {
					e.preventDefault()
					setPage(newPage)
				}}
			/>

		</div>
	)
}
export default MyTable