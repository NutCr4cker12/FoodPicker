import React, { useState, useEffect } from 'react'
import { browserHistory } from 'react-router'

import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, Slide, Typography } from '@material-ui/core'

import SessionModal from './SessionModal'

import { connect } from 'react-redux'
import { createWorker } from 'tesseract.js'

const useStyles = makeStyles(theme => ({
    root: {
        ...theme.root,
    },
    loaderDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "5rem",
        position: "absolute",
        width: "100%"
    },
    actionButtons: {
        position: "absolute",
        bottom: "3rem",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        margin: theme.spacing(2)
    },
    addBillButton: {
        margin: theme.spacing(2)
    }
}))

const Session = props => {
    const classes = useStyles()
    const [state, setState] = useState({
        worker: null,
        workerLoadProgress: 0,
        modalOpen: false,
    })

    useEffect(() => {
        const initWorker = async () => {
            const worker = createWorker({
                logger: m => {
                    if (m.status === "recognizing text") {
                        setState({ ...state, workerLoadProgress: m.progress })
                    }
                    console.log("Worker: ", m)
                }
            })

            await worker.load();
            await worker.loadLanguage("fin");
            await worker.initialize("fin");

            setState({ ...state, worker: worker })
        }
        if (!state.worker)
            initWorker()

        return () => {
            const kill = async () => {
                console.log("killing worker")
                await state.worker.terminate();
                console.log("Worker terminated")
            }
            if (state.worker)
                kill()
        }
    }, [])

    const redirBack = () => browserHistory.push("/payments");
    const addPayments = () => {
        // TODO
        console.log("Fake adding payments!")
        // browserHistory.push("/payments")
    }

    return <div className={classes.root}>
        <Button className={classes.addBillButton} variant="contained" color="primary" onClick={() => setState({ ...state, modalOpen: true })}>
            Add bill
        </Button>
        <SessionModal {...state} onClose={() => setState({ ...state, modalOpen: false })}
            onAdd={props => {
                console.log("Adding payment with: ", props)
                // TODO
            }} />
        <div className={classes.actionButtons}>
            <Button variant="contained" color="secondary" onClick={() => redirBack()}>Back</Button>
            <Button variant="contained" color="secondary" onClick={() => addPayments()}>Cancel</Button>
        </div>

        <Slide direction="up" in={!Boolean(state.worker)} mountOnEnter unmountOnExit>
            <div className={classes.loaderDiv}>
                <CircularProgress color="primary" variant="indeterminate" />
                <Typography color="primary">Worker loading...</Typography>
            </div>
        </Slide>
    </div>
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {

}

export default connect(mapStateToProps, mapDispatchToProps)(Session)