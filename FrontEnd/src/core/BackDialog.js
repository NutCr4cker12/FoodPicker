import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, Button, DialogTitle, DialogContent } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
	container: {
		margin: theme.spacing(1)
	},
}))

export default ({ open, onCancel, onOk, title, text, cancelText, okText }) => {
	const classes = useStyles()

	return (
		<div>
			<Dialog open={open} onClose={oncancel} className={classes.container}>
				<DialogTitle>
					{title}
				</DialogTitle>
				<DialogContent>
					{text}
				</DialogContent>
				<DialogActions>
					<Button onClick={onCancel} color="primary">
						{cancelText || "Cancel"}
          			</Button>
					<Button onClick={onOk} color="primary">
						{okText || "Apply"}
          				</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}