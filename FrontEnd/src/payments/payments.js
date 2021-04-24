import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Button, TextField, Table, TableContainer, TableRow, TableCell, TableBody, TableHead, InputAdornment, IconButton, Checkbox, Tooltip } from '@material-ui/core'
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Autocomplete from '@material-ui/lab/Autocomplete';
import MomentUtils from "@date-io/moment";
import { connect } from 'react-redux'

import TodayIcon from '@material-ui/icons/Today';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import MailIcon from '@material-ui/icons/Mail';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

import { boldSearch } from '../core/BoldSearch'
import { payments, pendingPayments } from '../api'
import { setError, setMessage } from '../App/AppActions';
import { setData, setDeleteId, setDistinctNotes } from './paymentAction'
import { openOnMail } from './MailDialog'
import TableRowCheckBox from './TableRowCheckBox'
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
    },
    sendMailButton: {
        marginLeft: "-30px",
        marginRight: "-30px"
    }
}))

// const MONHTLY_ALLOWANCE = 700

const formatDate = date => {
    if (typeof date === "string") date = new Date(date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${day}.${month}.${year}`
}

const formatNotes = note => {
    if (!note) return ""
    if (note.length < 50) return note;
    return `${note.substr(0, 50)}...`
}

const firstDate = new Date(2020, 0, 1)
const yearStart = new Date(new Date().getUTCFullYear(), 0, 1)
const yearEnd = new Date(new Date().getUTCFullYear(), 11, 31)

function Payments(props) {
    const classes = useStyles()
    const { data, deleteId, distinctNotes } = props;
    const { onGetData, onAddPayment, onSetDeleteId, onDeletePayment, onGetDistinctNotes, onSendMail } = props;

    const [date, setDate] = useState(new Date())
    const [amount, setAmount] = useState("")
    const [note, setNote] = useState("")
    const [autoCompleteKey, setAutoCompleteKey] = useState(true)
    const [startDate, setStartDate] = useState(yearStart)
    const [endDate, setEndDate] = useState(yearEnd)
    const [image, setImage] = useState({});
    const [inputRef, setInputRef] = useState(null);
    const [toMailList, setToMailList] = useState([])

    var total, perMonth;
    useEffect(() => {
        onGetData(startDate, endDate);
    }, [startDate, endDate, onGetData])

    useEffect(() => {
        if (distinctNotes.length === 0)
            onGetDistinctNotes();
    }, [onGetDistinctNotes, distinctNotes])

    if (data) {
        total = data.reduce((total, x) => total + x.amount, 0).toFixed(1)
        const months = data.length ? (new Date(data[0].date).getMonth() - startDate.getMonth()) : 1;

        perMonth = (total / months).toFixed(1);
    }
    const handleAddPayment = () => {
        if (parseFloat(amount) <= 0) return
        let payment = { date: date, amount: amount, notes: note }
        if (image.name || image.data)
            payment = { ...payment, imageName: image.name, imageData: image.data }
        onAddPayment(payment, startDate, endDate)
        setDate(new Date())
        setAmount("")
        setNote("")
        setAutoCompleteKey(!autoCompleteKey) // To re-render cleared autoComplete
        setImage({})
    }

    const AddImage = () => {
        if ((image.name || image.data) && !window.confirm("Replace current image?")) {
            return;
        }
        if (!inputRef) {
            console.error("No input Ref!!")
        } else {
            inputRef.click();
        }
    }

    const loadFile = () => {
        if (typeof window.FileReader !== 'function') {
            alert("The file API isn't supported on this browser yet.");
            return;
        }
        let input = document.getElementById('fileinput');
        if (!input) {
            alert("Um, couldn't find the fileinput element.");
        }
        else if (!input.files) {
            alert("This browser doesn't seem to support the 'files' property of file inputs.");
        }
        else if (!input.files[0]) {
            alert("Please select an Excel file before clicking 'Process'");
        }
        else {
            const selectedFile = input.files[0]

            input.files = null // Without these the second upload try won't fire the onChange event
            input.value = ''

            let fileReader = new FileReader();
            fileReader.onload = e => {
                setImage({
                    name: selectedFile.name,
                    data: e.target.result
                })
            }
            fileReader.readAsDataURL(selectedFile);
        }
    }

    const downloadImage = (image) => {
        var a = document.createElement("a");
        a.href = image.data;
        a.download = image.name;
        a.click();
    }

    const handleMailList = (data) => {
        // Already in the list -> remove it
        if (toMailList.find(d => d._id === data._id) != null) {
            setToMailList(toMailList.filter(x => x._id !== data._id));
        } else {
            toMailList.push(data);
            setToMailList([...toMailList]);
        }
    }

    const openMailAndMarkSend = () => {
        const pending = {
            isMarked: false,
            ids: toMailList.map(x => x._id)
        }
        pendingPayments.create(pending)
            .then(pendingEntity => {
                openOnMail(toMailList, pendingEntity._id);
                onSendMail(startDate, endDate, toMailList);
                setToMailList([])
            })
            .catch(err => console.error(err))
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
                <Autocomplete
                    key={autoCompleteKey}
                    freeSolo
                    options={distinctNotes}
                    renderOption={option => boldSearch(option, note)}
                    renderInput={props =>
                        <TextField
                            {...props}
                            label="Note"
                            value={note}
                            fullWidth
                            onChange={e => setNote(e.target.value)} />
                    }
                    onChange={(e, value) => setNote(value || "")}
                />
            </div>
            <Button
                className={classes.spacing}
                variant="contained"
                color="primary"
                onClick={() => AddImage()}>
                Add Image
            </Button>
            {image.name &&
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Button onClick={() => downloadImage(image)}>
                        {image.name}
                    </Button>
                    <IconButton onClick={() => setImage({})}>
                        <DeleteForeverIcon />
                    </IconButton>
                </div>}
            <Button
                className={classes.spacing}
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleAddPayment()}>
                Add Payment
			</Button>
        </div>
    )

    const table = (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {datePicker("from", startDate, setStartDate, ["year", "month"], "MM.YY", firstDate, endDate)}
                        </TableCell>
                        <TableCell>
                            {datePicker("to", endDate, setEndDate, ["year", "month"], "MM.YY", startDate, yearEnd)}
                        </TableCell>
                        <TableCell>{`Total: ${total} €`}</TableCell>
                        <TableCell>{`PerMonth: ${perMonth} €`}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                    </TableRow>
                    <TableRow>
                        <TableCell>Created</TableCell>
                        <TableCell>Bill Due</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Pdf</TableCell>
                        <TableCell>
                            {toMailList.length > 0 ?
                                <Button variant="contained" color="primary"
                                    className={classes.sendMailButton}
                                    onClick={openMailAndMarkSend}
                                    endIcon={<MailIcon />}>
                                    Send
                                </Button>
                                : <IconButton disabled ><MailIcon /></IconButton>}
                        </TableCell>
                        <TableCell className={classes.tableIcon}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data ? data.map(d => (
                        <TableRow key={d.date}>
                            <TableCell>{formatDate(d.createdAt)}</TableCell>
                            <TableCell>{formatDate(d.date)}</TableCell>
                            <TableCell>{d.amount} €</TableCell>
                            <TableCell>{formatNotes(d.notes)}</TableCell>
                            <TableCell>
                                {d.imageName &&
                                    <Button onClick={() => downloadImage({ name: d.imageName, data: d.imageData })}>
                                        {d.imageName}
                                    </Button>
                                }
                            </TableCell>
                            <TableCell>
                                <TableRowCheckBox
                                    rowData={d}
                                    onChange={() => handleMailList(d)}
                                    toMailList={toMailList}
                                />
                            </TableCell>
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
            <input type="file"
                id="fileinput"
                style={{ display: "none" }}
                accept=".pdf"
                ref={elem => setInputRef(elem)}
                onChange={() => loadFile()} />
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        data: state.payment.data,
        deleteId: state.payment.deleteId,
        distinctNotes: state.payment.distinctNotes,
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
                createdAt: -1
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
        },
        onGetDistinctNotes: () => {
            payments.list({})
                .then(res => {
                    const allNotes = res.data.map(x => x.notes)
                    const distinctNotes = [...new Set(allNotes)]
                    if (distinctNotes.length === 0)
                        distinctNotes.push("...")
                    dispatch(setDistinctNotes(distinctNotes))
                })
                .catch(err => dispatch(setError(err.message)))
        },
        onSendMail: async (start, end, paymentList) => {
            for (let index = 0; index < paymentList.length; index++) {
                const payment = paymentList[index];
                await payments.patch(payment._id, { mailed: true });
            }
            getData(start, end);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)