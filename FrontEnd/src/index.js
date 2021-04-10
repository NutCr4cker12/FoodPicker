import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import feathers from '@feathersjs/client'
import rest from '@feathersjs/rest-client'
import authentication from '@feathersjs/authentication-client'
import superagent from 'superagent'

import App from './App/App'
import SignIn from './signin/SignIn'
import Home from './home/home'
import Foods from './foods/Foods'
import ShopList from './shoplist/Shoplist'
import Payments from './payments/payments'
import Transactions from './transactions/Transactions'
import Categories from './categories/Categories'
import Session from './payments/Session/Session'

import reducers from './reducers'
import { authUser } from './App/AppActions'

const store = createStore(reducers)

if (process.env.NODE_ENV === "development") {
	console.log('This app is using DEVELOPMENT environment');
	console.log('REACT_APP_API_URL = ' + process.env.REACT_APP_API_URL);
	console.log('REACT_APP_OAUTH_URL = ' + process.env.REACT_APP_OAUTH_URL);
}
if (process.env.NODE_ENV === "production") {
	if (!process.env.REACT_APP_API_URL)
		console.error('REACT_APP_API_URL is not set!')
	if (!process.env.REACT_APP_OAUTH_URL)
		console.error('REACT_APP_OAUTH_URL is not set!')
}

const app = feathers()
	.configure(rest(process.env.REACT_APP_API_URL).superagent(superagent))
	.configure(authentication({ storage: window.localStorage }))

function handlePath(pathname) {
	if (pathname === '/signin' || pathname === '/passwordreset') {
		return;
	}

	//Get user from Redux state
	const user = store.getState().user;
	//If we have no user, none is logged in.
	if (!user || !user._id) {
		browserHistory.push('/signin');
		return;
	}

	// if (pathname !== "/home" || pathname !== "/signin" || pathname !== "/foods" || pathname !== "/shoplist") {
	// 	browserHistory.push("/home");
	// 	return;
	// }
}

function enterHandler() {
	const pathname = window.location.pathname
	handlePath(pathname)
}


app.reAuthenticate()
	.then(r => {
		//Populate Redux state with user information if authenticated.
		store.dispatch(authUser(r.user))
		initRender()
	})
	.catch(err => {
		initRender()
	})


function initRender() {
	ReactDOM.render((
		<Provider store={store}>
			<Router history={browserHistory}>
				<Route path="/" component={App} onEnter={enterHandler}>
					<Route path="/home" component={Home} />
					<Route path="/signin" component={SignIn} />
					<Route path="/foods" component={Foods} />
					<Route path="/shoplist" component={ShopList} />
					<Route path="/payments" component={Payments} />
                    {/* <Route path="/payments/session" component={Session} /> */}
                    {/* <Route path="/transactions" component={Transactions} />
                    <Route path="/categories" component={Categories} /> */}
				</Route>
			</Router>
		</Provider>
	), document.getElementById('root'))
}

export default app
