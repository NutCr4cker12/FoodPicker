import React from 'react'

import { browserHistory } from 'react-router'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { capitalCase } from "capital-case";
import { connect } from 'react-redux';

import { closeDrawer } from '../App/AppActions'

const NavItem = (props) => {
	const { path, icon, onNavigate } = props;

	return (
		<ListItem button key={path} onClick={() => onNavigate(`/${path}`)}>
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText primary={capitalCase(path)} />
		</ListItem>
	)
}

const mapStateToProps = (state) => {
	return {

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

export default connect(mapStateToProps, mapDispatchToProps)(NavItem)