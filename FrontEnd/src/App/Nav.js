import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';

import { browserHistory } from 'react-router'

import HomeIcon from '@material-ui/icons/Home';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';
import TimelineIcon from '@material-ui/icons/Timeline';

import { connect } from 'react-redux';
import { closeDrawer, openDrawer } from './AppActions'
import NavItem from '../core/NavItem'

const Nav = ({user, drawerOpen, onOpenDrawer, onCloseDrawer, onNavigate}) => {
	let menuItems = []


	if (user._id) {
		menuItems.push(<Divider key="div1" />)
		menuItems.push(<NavItem key={1} path={"home"} icon={<HomeIcon/>} />)
		menuItems.push(<NavItem key={2} path="foods" icon={<FastfoodIcon />} />)
		if (user.role === "admin") {
            menuItems.push(<NavItem key={4} path="payments" icon={<PaymentIcon />} />)
            menuItems.push(<NavItem key={5} path="minermonitor" icon={<TimelineIcon />} />)
		}
		menuItems.push(<Divider key="div2" />)

		return (
			<Drawer 
				open={drawerOpen}
				onClose={open => open? onCloseDrawer() : onOpenDrawer()}
				>
					<List>
						{menuItems}
					</List>
				</Drawer>
		)
	}
	return (<div/>)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		drawerOpen: state.drawer.open
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	  onOpenDrawer: () => {
		dispatch(openDrawer())
	  },
	  onCloseDrawer: () => {
		dispatch(closeDrawer())
	  },
	  onNavigate: pathname => {
		browserHistory.push(pathname)
		dispatch(closeDrawer())
	  }    
	}
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(Nav)