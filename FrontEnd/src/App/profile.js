import React from 'react'

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider'

import ActionExitToApp from '@material-ui/icons/ExitToApp';

//////////////////////////////////////////////////////////////////////////////

import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { closeProfile, setMessage, deauthUser } from '../App/AppActions'
import { users } from '../api'

//////////////////////////////////////////////////////////////////////////////

const profile = ({ user, profileOpen, onCloseProfile, anchorEl, onSignOut }) => {

	return (
		<Menu
			anchorEl={anchorEl}
			keepMounted
			open={profileOpen}
			onClose={onCloseProfile}
			disableAutoFocus={true}
		>
			<MenuItem disabled={true} style={{ opacity: 1 }}>
				<ListItemText primary={`Signed in as: ${user.isQuest ? " Quest" : ""}`} />
			</MenuItem>
			<MenuItem disabled={true} style={{ opacity: 1 }}>
				<ListItemText primary={user.name} secondary={user.email} />
			</MenuItem>
			<Divider />
			<MenuItem onClick={() => {
				onCloseProfile()
				onSignOut()
			}}>
				<ListItemIcon><ActionExitToApp /></ListItemIcon>
				<ListItemText primary='Sign Out' />
			</MenuItem>
		</Menu>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		profileOpen: state.profile.open,
		anchorEl: state.profile.anchor
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onCloseProfile: () => {
			dispatch(closeProfile())
		},
		onNavigate: pathname => {
			browserHistory.push(pathname)
		},
		onSignOut: () => {
			const timeout = setTimeout(() => {
				dispatch(setMessage('Connection timeout during sign out.'))
			}, 5000)
			users.signOut()
				.then(() => {
					clearTimeout(timeout)
					dispatch(setMessage('Signed out.'))
					dispatch(deauthUser())
					// eslint-disable-next-line no-restricted-globals
					browserHistory.push('/signin');
				})
				.catch(err => {
					clearTimeout(timeout)
					dispatch(setMessage(err.message))
				})
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(profile)
