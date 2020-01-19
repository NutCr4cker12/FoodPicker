import React from 'react'
import { AppTheme } from '../theme'
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header'
import Message from './Message'

import Nav from './Nav'
import Profile from './profile'
// import MediaQuery from 'react-responsive'

export default class App extends React.Component {

	render() {
		let navBar, profileMenu;
		if (this.props.location.pathname !== "/signin") {
			navBar =
				<div>
					<Nav />
				</div>
			profileMenu = <div><Profile /></div>
		}
		return (
			<AppTheme>
				<div>
					<CssBaseline />
					<Header location={this.props.location} />
					{navBar}
					{profileMenu}
					<div>
						{this.props.main}
						{this.props.children}
					</div>
					<Message />
				</div>
			</AppTheme>
		)
	}
}
