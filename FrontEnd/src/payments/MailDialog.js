import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, Button, DialogTitle, DialogContent, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(1)
    },
    content: {
        display: "flex",
        flexDirection: "column",
    }
}))

const formatDate = oDate => {
    let date = new Date(oDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${day}.${month}`
}

const createDefaultContent = payments => {
    let paymentText = "";
    payments.forEach(p => {
        paymentText += `${p.notes}, ${p.amount}€, eräpäivä: ${formatDate(p.date)}\n`;
    })
    return `Hei,\n\nLiitteenä taas laskuja:\n\n${paymentText}\nTerveisin,\nKimi Heinonen\n`
}

const MailDialog = props => {
    const classes = useStyles()
    const { payments, onSend, onCancel } = props;
    const [state, setState] = useState({
        from: process.env.REACT_APP_MAIL_FROM,
        to: process.env.REACT_APP_MAIL_TO,
        title: "Laskuja",
        content: createDefaultContent(payments)
    })

    return (
        <Dialog open={true} onClose={onCancel} className={classes.container} fullWidth>
            <DialogTitle>Mail preview</DialogTitle>
            <DialogContent className={classes.content}>
                <TextField className={classes.container} label="From" value={state.from} onChange={e => setState({ ...state, from: e.target.value })} />
                <TextField className={classes.container} label="To" value={state.to} onChange={e => setState({ ...state, to: e.target.value })} />
                <TextField className={classes.container} label="Title" value={state.title} onChange={e => setState({ ...state, title: e.target.value })} />
                <div>
                    {payments.map(payment => (
                        <Button disabled key={payment._id} >{payment.imageName}</Button>
                    ))}
                </div>
                <TextField className={classes.container} label="Content" value={state.content} onChange={e => setState({ ...state, content: e.target.value })}
                    multiline
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={() => {
                    window.open(`mailto:${state.to}?subject=${state.title}&body=${encodeURIComponent(state.content)}`);
                    onSend()
                }}>
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MailDialog