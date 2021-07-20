import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import { makeStyles } from '@material-ui/core/styles';

import ActionLock from '@material-ui/icons/Lock'

// import { CookieDisclaimer } from '../home/CookieDisclaimer'

//////////////////////////////////////////////////////////////////////////////

import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { setMessage, setError, authUser } from '../App/AppActions'
import { users } from '../api'

//////////////////////////////////////////////////////////////////////////////

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: "8rem",
		display: 'flex',
		margin: theme.spacing(2),
	},
	TextField: {
		display: "flex",
		margin: theme.spacing(2),
		paddingRight: theme.spacing(4)
	}
}))

function SignIn(props) {
	const classes = useStyles();
	const [error] = useState();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { onSignIn } = props;

	const submitHanlder = event => {
		event.preventDefault()
		onSignIn(email, password)
	}

	return (
		<div className={classes.root}>
			<Paper elevation={3} style={{ width: "100%"}}>
				<List subheader={<ListSubheader>Sign In</ListSubheader>}>
					<form onSubmit={submitHanlder} style={{ marginTop: '24px' }}>
						<div>
							<TextField
								className={classes.TextField}
								label="Email"
                                value={email}
								fullWidth={true}
								onChange={e => setEmail(e.target.value)}
								type="email"
								error={!!error}
								helperText={error === 1 || error === 3 ? "E-mail is required" : error === 4 ? 'E-mail does not contain "@" symbol' : null}
							/>
						</div>
						<div>
							<TextField
								className={classes.TextField}
								label="Password"
                                value={password}
								fullWidth={true}
								onChange={e => setPassword(e.target.value)}
								type="password"
								error={!!error}
								helperText={error === 2 || error === 3 ? 'Password is required' : null}
							/>
						</div>
						<div>
							<Button
								variant="contained"
								color="primary"
								startIcon={<ActionLock />}
								onClick={submitHanlder}
								className={classes.TextField}
							>Sign In</Button>
						</div>
						<input type="submit" style={{ display: "none" }} />
					</form>
				</List>
			</Paper>
		</div>
	)
}


//////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSignIn: (email, password) => {
			if (email.length === 0 && password.length === 0) {
				dispatch(setMessage('E-mail and password cannot be empty'))
				return { user: null, error: Promise.resolve(3) }
			}
			if (email.length === 0) {
				dispatch(setMessage('E-mail cannot be empty'))
				return { user: null, error: Promise.resolve(1) }
			}
			if (email.indexOf('@') === -1) {
				dispatch(setMessage('E-mail does not contain "@" symbol'))
				return { user: null, error: Promise.resolve(4) }
			}
			if (password.length === 0) {
				dispatch(setMessage('Password cannot be empty'))
				return { user: null, error: Promise.resolve(2) }
			}
			dispatch(setMessage('Signing in...'))
			const timeout = setTimeout(() => {
				dispatch(setMessage('Connection timeout during sign in.'))
			}, 5000)
			return users.signIn(email, password)
				.then(result => {
					clearTimeout(timeout)
					dispatch(setMessage('Signed in.'));
					dispatch(authUser(result.user));
					browserHistory.push('/home')
					return { user: result.user, error: null }
				}).catch(err => {
					clearTimeout(timeout)
					if (err.name === 'MongoError') {
						dispatch(setMessage('Server error. Try again later.'))
					} else if (err.name === 'NotAuthenticated') {
						dispatch(setMessage('Unable to sign in. Invalid e-mail or password.'))
					} else {
						dispatch(setError('Error: ' + err.name + err.message))
					}
					browserHistory.push('/')
					setTimeout(() => browserHistory.push('/signin'), 10)
					return { user: null, error: err };
				})
		},
		onSignInGoogle: () => {
			//   dispatch(setMessage('Signing in...'))
			//   return users.signInGoogle()
		},
		onResetPassword: () => {
			//   browserHistory.push('/passwordreset')
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
