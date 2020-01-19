import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import { closeDrawer, openDrawer, openProfile, closeProfile } from './AppActions'

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(theme => ({
	navBar: {
		zIndex: theme.zIndex.drawer + 1,
		position: "fixed",
		top: 0,
		left: 0,
		margin: 0,
		// backgroundColor: theme.palette.primary.dark
	},
	separate: theme.separate
}))

const Header = ({ location, user, drawerOpen, onOpenDrawer, onCloseDrawer, profileOpen, onOpenProfile, onCloseProfile }) => {
	const classes = useStyles();
	let appbar, mobileNavIcon, profileButton

	profileButton = (
		user._id != null &&
		<div>
			<IconButton onClick={profileOpen ? onCloseProfile : onOpenProfile} style={{ color: 'white' }}>
				<AccountCircleIcon fontSize="large" />
			</IconButton>
		</div>
	)

	if (location.pathname === '/signin') {
		//do nothing
	}
	else
		mobileNavIcon =
			<IconButton edge="start" style={{ color: 'white' }} onClick={() => {drawerOpen ? onCloseDrawer() : onOpenDrawer()}} >
				<MenuIcon />
			</IconButton>

	appbar = (
		<AppBar position="static" className={classes.navBar}>
			<Toolbar>
				{mobileNavIcon}
				<div className={classes.separate} />
				{profileButton}
			</Toolbar>
		</AppBar>
	)

	return (
		<header>
			{appbar}
		</header>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		drawerOpen: state.drawer.open,
		profileOpen: state.profile.open
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
		},
		onOpenProfile: (event) => {
			dispatch(openProfile(event.currentTarget))
		},
		onCloseProfile: () => {
			dispatch(closeProfile())
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)