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
    datePickerTextfieldWide: {
        width: "110px"
    },
    datePickerTextfieldSmall: {
        width: "70px"
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

const yearStart = new Date(new Date().getUTCFullYear(), 0, 2)
const yearEnd = new Date(new Date().getUTCFullYear(), 11, 31)

function Payments(props) {
    const classes = useStyles()
    const { data, deleteId } = props;
    const { onGetData, onAddPayment, onSetDeleteId, onDeletePayment } = props;

    const [date, setDate] = useState(new Date())
    const [amount, setAmount] = useState("")
    const [note, setNote] = useState("")
    const [startDate, setStartDate] = useState(yearStart)
    const [endDate, setEndDate] = useState(yearEnd)

    var total, perMonth;
    if (!data) onGetData(startDate, endDate)
    else {
        total = data.reduce((total, x) => total + x.amount, 0).toFixed(1)
        const months = new Date(data[0].date).getUTCMonth() - new Date(data[data.length - 1].date).getUTCMonth() + 1
        
        perMonth = (total / months).toFixed(1);
    }
    const handleAddPayment = () => {
        if (parseFloat(amount) <= 0) return
        onAddPayment({ date: date, amount: amount, notes: note }, startDate, endDate)
        setDate(new Date())
        setAmount("")
        setNote("")
    }

    const datePicker = (label, value, setValue, views, format, minDate = new Date(2020, 0, 1), maxDate = yearEnd) => (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
                label={label}
                format={format}
                views={views}
                minDate={minDate}
                maxDate={maxDate}
                showTodayButton={true}
                value={value}
                onChange={date => setValue(date._d)}
                animateYearScrolling
                TextFieldComponent={(props) => (
                    <TextField
                        label={label}
                        onClick={props.onClick}
                        value={props.value}
                        InputProps={{
                            endAdornment: <TodayIcon />
                        }}
                        size="small"
                        className={format.split(".").length > 2 ? classes.datePickerTextfieldWide : classes.datePickerTextfieldSmall}
                    />
                )}
            />
        </MuiPickersUtilsProvider>
    )

    const addPayment = (
        <div className={classes.centerDivColumn}>
            <div className={`${classes.spacing} ${classes.centerDivColumn}`}>
                {datePicker("Date", date, setDate, ["year", "month", "date"], "DD.MM.YYYY")}
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
            <div className={classes.spacing}>
                <TextField
                    label="Note"
                    value={note}
                    onChange={e => setNote(e.target.value)}
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
                        {/* <TableCell>{`Count: ${count}`}</TableCell> */}
                        <TableCell>{`Total: ${total} €`}</TableCell>
                        <TableCell>{`PerMonth: ${perMonth} €`}</TableCell>
                        <TableCell>
                            {datePicker("startDate", startDate, setStartDate, ["year", "month"], "MM.YY", yearStart, endDate)}
                        </TableCell>
                        <TableCell>
                            {datePicker("endDate", endDate, setEndDate, ["year", "month"], "MM.YY", startDate, yearEnd)}
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
                onOk={() => onDeletePayment(deleteId, startDate, endDate)}
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
    const getData = (start, end) => {
        payments.list({
            date: {
                $gt: start,
                $lt: end
            },
            $sort: {
                date: -1
            }
        }).then(res => dispatch(setData(res.data)))
            .catch(err => dispatch(setError(err.message)))
    }
    return {
        onGetData: (start, end) => getData(start, end),
        onAddPayment: (payment, start, end) => {
            payments.create(payment)
                .then(res => {
                    dispatch(setMessage("Payment Added"))
                    getData(start, end)
                })
                .catch(err => dispatch(setError(err.message)))
        },
        onSetDeleteId: (id) => {
            dispatch(setDeleteId(id))
        },
        onDeletePayment: (id, start, end) => {
            payments.remove(id)
                .then(res => {
                    dispatch(setMessage("Payment Deleted"))
                    dispatch(setDeleteId(null))
                    getData(start, end)
                })
                .catch(err => dispatch(setError(err.message)))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)