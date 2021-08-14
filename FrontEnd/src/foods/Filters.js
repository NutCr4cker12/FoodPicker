import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { Dialog, DialogActions, Button, Tabs, Tab } from '@material-ui/core';

import FilterSection from './FilterSection'
import FilterSorting from './FilterSorting'
import TabContent from '../core/TabContent'

const useStyles = makeStyles(theme => ({
	tabs: {
		width: "100%",
	},
	container: {
		margin: theme.spacing(1)
	},
	actionContent: {
		alignItems: "stretch",
		justifyContent: "space-between"
	},
}))

const copyObj = filters => {
	return JSON.parse(JSON.stringify(filters))
}


const Filters = ({ onApply, filtersOpen, setOpenFilter, currentFilters, currentSort, clearFilters }) => {
	const classes = useStyles()
	const [tabValue, setTabValue] = useState(0)
	const [filters, setFilters] = useState(copyObj(currentFilters))
	const [sort, setSort] = useState(copyObj(currentSort))

	if (!filters.main.liha && currentFilters.main.liha) {
		setFilters(copyObj(currentFilters))
	}

	return (
		<div>
			<Dialog open={filtersOpen} maxWidth={"md"} onClose={() => {
				setFilters(copyObj(currentFilters))
				setSort(copyObj(currentSort))
				setOpenFilter()
			}} >
				<div className={classes.container}>
					<Tabs
						variant="fullWidth"
						className={classes.tabs}
						indicatorColor="primary"
						textColor="primary"
						value={tabValue}
						onChange={(e, value) => setTabValue(value)}
					>
						<Tab label="Filters" />
						<Tab label="Sort" />
					</Tabs>
					<TabContent value={tabValue} index={0} boxProps={{
                        style: { paddingLeft: "0px" }
                    }} >
						<FilterSection
							filters={filters}
							setFilters={f => setFilters(copyObj(f))}
						/>
					</TabContent>
					<TabContent value={tabValue} index={1} >
						<FilterSorting 
							sort={sort}
							setSort={s => setSort(copyObj(s))}
						/>
					</TabContent>
				</div>
				<DialogActions className={classes.actionContent}>
					<Button onClick={() => {
						filters.main.liha = null;
						setFilters(filters)
						setSort({})
						clearFilters()
					}} color="primary" >
						Clear Filters
          			</Button>
					<Button onClick={() => {
						setOpenFilter()
						onApply(filters, sort)
					}} color="primary" autoFocus>
						Apply
          				</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		currentFilters: state.food.filters,
		filtersOpen: state.food.filtersOpen
	}
}

const mapDispatchToProps = (dispatch) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters)