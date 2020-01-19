import React from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';

import { connect } from 'react-redux'
import { setMessage } from './AppActions'

const Message = ({ text, err, onClose }) => (
	<Snackbar
		open={Boolean(err || text)}
		autoHideDuration={3000}
		onClose={onClose}
		// anchorOrigin={{horizontal: "center", vertical: "top"}}
	>
		<MuiAlert
			elevation={6}
			variant="filled"
			onClose={onClose}
			severity={err ? "error" : text ? "success" : "info"}
		>
			{err ? err : text ? text : ""}
		</MuiAlert>
	</Snackbar>
)


const mapStateToProps = (state) => {
	return {
		text: state.app.message,
		err: state.app.err
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onClose: () => {
			dispatch(setMessage(""))
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Message)
