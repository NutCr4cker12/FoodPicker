import React from 'react'

import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles'
import { browserHistory } from 'react-router'

import FastfoodIcon from '@material-ui/icons/Fastfood';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';
import TimelineIcon from '@material-ui/icons/Timeline';

import { connect } from 'react-redux';
import { closeDrawer } from '../App/AppActions'
import NavItem from '../core/NavItem'

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: "10rem",
		marginLeft: "1rem",
		marginRight: "1rem"
	}
}))

const Home = (props) => {
	const classes = useStyles()
	const { user } = props;
	let menuItems = []

	menuItems.push(<NavItem key={0} path="foods" icon={<FastfoodIcon />} />)
	menuItems.push(<NavItem key={1} path="shoplist" icon={<ShoppingCartIcon />} />)
	if (user.role === "admin") {
        menuItems.push(<NavItem key={2} path="payments" icon={<PaymentIcon />} />)
        menuItems.push(<NavItem key={3} path="minermonitor" icon={<TimelineIcon />} />)
	}

	return (
		<div>
			<List className={classes.paper}>
				{menuItems}
			</List>

		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onNavigate: pathname => {
			browserHistory.push(pathname)
			dispatch(closeDrawer())
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)