import React, { useEffect, useState } from 'react'

import { pendingPayments } from '../api'
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';

const MarkPendingPayments = props => {
    const [state, setState] = useState({
        dialogOpen: false,
        seconds: 0
    })
    const id = props.params.id;

    useEffect(() => {
        let timer;
        if (!state.dialogOpen)
            return;

        if (state.seconds === 0) {
            closeAndRedirect();
        } else {
            let newSeconds = state.seconds - 1;
            timer = setTimeout(() => setState({ ...state, seconds: newSeconds }), 1000);
        }
        return () => clearTimeout(timer);
    }, [state.seconds])

    const closeAndRedirect = () => {
        setState({ dialogOpen: false, seconds: 0 })
        window.close();
    }

    useEffect(() => {
        if (id) {
            pendingPayments.get(id.replace(":", ""))
                .then(res => {
                    if (res && res.alreadyMarked) {
                        window.close();
                    } else {
                        setState({ dialogOpen: true, seconds: 5 })
                    }
                })
                .catch(err => {
                    console.error(err)
                    window.close();
                })
        } else {
            window.close();
        }
    }, [])

    console.log("FOOBAR")

    return (
        <Dialog open={state.dialogOpen}>
            <DialogContent>
                {`Laskut merkattu maksetuksi\n\n

    Tämä sulkeutuu automaattisesti ${state.seconds} sekunnin kuluttua...`}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={() => closeAndRedirect()}>
                    Close
        </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MarkPendingPayments