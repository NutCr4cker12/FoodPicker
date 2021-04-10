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

const createDefaultContent = mails => {
    return `Hei,
    
    Liitteenä taas laskuja.

    Ps. tämä sähköposti on automaattisesti generoitu. Jos laskut eivät aukea tai huomaat jotain outoa, ilmoitathan.
    
    Terveisin,
    Kimi Heinonen`
}

const MailDialog = props => {
    const classes = useStyles()
    const { mails, onSend, onCancel } = props;
    const [state, setState] = useState({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        title: "Laskuja",
        content: createDefaultContent(mails)
    })

    console.log("ENV: ", process.env)

    return (
        <Dialog open={true} onClose={onCancel} className={classes.container} fullWidth>
            <DialogTitle>Mail preview</DialogTitle>
            <DialogContent className={classes.content}>
                <TextField className={classes.container} label="From" value={state.from} onChange={e => setState({ ...state, from: e.target.value })} />
                <TextField className={classes.container} label="To" value={state.to} onChange={e => setState({ ...state, to: e.target.value })} />
                <TextField className={classes.container} label="Title" value={state.title} onChange={e => setState({ ...state, title: e.target.value })} />
                <div>
                    {mails.map(mail => (
                        <Button disabled id={mail._id} >{mail.imageName}</Button>
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
                <Button variant="contained" color="primary" onClick={() => onSend(state.from, state.to, state.title, state.content)}>
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MailDialog