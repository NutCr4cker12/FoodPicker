import React from 'react'
import { AppTheme } from '../theme'
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header'
import Message from './Message'

import Nav from './Nav'
import Profile from './profile'

export default class App extends React.Component {

    render() {
        let navBar, profileMenu;
        if (this.props.location.pathname !== "/signin") {
            navBar = <Nav />
            profileMenu = <Profile />
        }
        return (
            <AppTheme>
                <div>
                    <CssBaseline />
                    <Header location={this.props.location} />
                    {navBar}
                    {profileMenu}
                    {this.props.main}
                    {this.props.children}
                    <Message />
                </div>
            </AppTheme>
        )
    }
}
