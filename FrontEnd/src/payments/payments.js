import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Button, TextField, Table, TableContainer, TableRow, TableCell, TableBody, TableHead, InputAdornment, IconButton } from '@material-ui/core'
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { connect } from 'react-redux'

import TodayIcon from '@material-ui/icons/Today';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { payments } from '../api'
import { setError, setMessage } from '../App/AppActions';
import { setData, setDeleteId } from './paymentAction'
import BackDialog from '../core/BackDialog'

const useStyles = makeStyles(theme => ({
	root: theme.root,
	centerDivColumn: theme.centerDivColumn,
	spacings: {
		padding: theme.spacing(2),
		width: "10px"
	},
	datePickerTextfield: {
		width: "110px"
	},
	tableIcon: {
		width: "5px"
	},
	spacing: {
		margin: theme.spacing(2),
		width: "200px"
	}
}))

const MONHTLY_ALLOWANCE = 700

const formatDate = date => {
	if (typeof date === "string") date = new Date(date)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return `${day}.${month}.${year}`
}

const formatNotes = note => {
	if (!note) return ""
	if (note.length < 10) return note;
	return `${note.substr(0, 10)}...`
}

/*
TODO TO ADD:
Telia 32.99 
Pohjola 20.01
Pohjola 53.83
L&T 129.07
Luottokortti 317.98

*/

/*
	TODO: Count total sum for the month 
			Count 'left to spend' fro the month
			Add Edit for payments
			Alternative search options ? (for specific month etc.. ?)
*/

function Payments(props) {
	const classes = useStyles()
	const { data, deleteId } = props;
	const { onGetData, onAddPayment, onSetDeleteId, onDeletePayment } = props;
	const [date, setDate] = useState(new Date())
	const [amount, setAmount] = useState("")

	var total, left, count;
	if (!data) onGetData()
	else {
		total = data.reduce((total, x) => total + x.amount, 0)
		left = MONHTLY_ALLOWANCE - total;
		count = data.length;
	}

	const handleAddPayment = () => {
		if (parseFloat(amount) <= 0) return
		onAddPayment({ date: date, amount: amount })
		setDate(new Date())
		setAmount("")
	}

	const addPayment = (
		<div className={classes.centerDivColumn}>
			<div className={`${classes.spacing} ${classes.centerDivColumn}`}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<DatePicker
					label="Date"
					format="DD.MM.YYYY"
					views={["year", "month", "date"]}
					minDate={new Date(2020, 0, 1)}
					showTodayButton={true}
					value={date}
					onChange={date => setDate(date._d)}
					animateYearScrolling
					TextFieldComponent={(props) => (
						<TextField
							label="Date"
							onClick={props.onClick}
							value={props.value}
							InputProps={{
								startAdornment: <TodayIcon />
							}}
							size="small"
							className={classes.datePickerTextfield}
						/>

					)}
				/>
			</MuiPickersUtilsProvider>
			</div>
			<div className={classes.spacing}>
			<TextField
				value={amount}
				type="number"
				variant="outlined"
				onChange={e => setAmount(e.target.value.replace(",", "."))}
				InputProps={{
					endAdornment: <InputAdornment position="end">€</InputAdornment>,
				}}
			/>
			</div>
			<Button
				className={classes.spacing}
				variant="contained"
				color="primary"
				startIcon={<AddIcon />}
				onClick={() => handleAddPayment()}
			>
				Add Payment
				</Button>
		</div>
	)

	const table = (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>{`Count: ${count}`}</TableCell>
						<TableCell>{`Total: ${total} €`}</TableCell>
						<TableCell>{`Left: ${left} €`}</TableCell>
						<TableCell>
							{/* <Button onClick={() => onMonthSelect()}>
							Select Month // TODO IMPLEMENT MONTH SELECTING
							</Button> */}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Date</TableCell>
						<TableCell>Amount</TableCell>
						<TableCell>Notes</TableCell>
						<TableCell className={classes.tableIcon}></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data ? data.map(d => (
						<TableRow key={d.date}>
							<TableCell>{formatDate(d.date)}</TableCell>
							<TableCell>{d.amount} €</TableCell>
							<TableCell>{formatNotes(d.notes)}</TableCell>
							<TableCell className={classes.tableIcon}>
								<IconButton onClick={() => onSetDeleteId(d._id)}>
									<DeleteForeverIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					)) : null}
				</TableBody>
			</Table>
		</TableContainer>
	)
	return (
		<React.Fragment>
			<Paper className={classes.root}>
				{addPayment}
			</Paper>
			{table}
			<BackDialog
				open={Boolean(deleteId)}
				onClose={() => onSetDeleteId(null)}
				title="Delete payment"
				text="Are you sure?"
				okText={"Delete"}
				onOk={() => onDeletePayment(deleteId)}
			/>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => {
	return {
		data: state.payment.data,
		deleteId: state.payment.deleteId,
	}
}

const mapDispatchToProps = (dispatch) => {
	const getData = () => {
		const today = new Date()
		const startOfTheMonth = new Date(today.getFullYear(), today.getMonth(), 0).getTime()
		payments.list({
			date: {
				$gt: startOfTheMonth
			},
			$sort: {
				date: -1
			}
		}).then(res => dispatch(setData(res.data)))
		.catch(err => dispatch(setError(err.message)))
	}
	return {
		onGetData: () => getData(),
		onAddPayment: (payment) => {
			payments.create(payment)
				.then(res => {
					dispatch(setMessage("Payment Added"))
					getData()
				})
				.catch(err => dispatch(setError(err.message)))
		},
		onSetDeleteId: (id) => {
			dispatch(setDeleteId(id))
		},
		onDeletePayment: (id) => {
			payments.remove(id)
				.then(res => {
					dispatch(setMessage("Payment Deleted"))
					dispatch(setDeleteId(null))
					getData()
				})
				.catch(err => dispatch(setError(err.message)))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)