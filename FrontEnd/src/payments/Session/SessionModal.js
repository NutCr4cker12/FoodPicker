import React, { useState, useRef } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, TextField, CircularProgress, LinearProgress } from '@material-ui/core'

import { parseImageResult } from './textParser';

const useStyles = makeStyles(theme => ({
    progressDiv: {
        position: "absolute",
        bottom: "5rem",
        width: "100%"
    }
}))

const SessionModal = props => {
    const classes = useStyles()

    const { worker, workerLoadProgress, modalOpen, onClose, onAdd } = props;
    const [state, setState] = useState({
        viite: "",
        iban: "",
        saaja: "",
        euro: 0,
        dueDate: new Date(),
        image: null,
    })
    const imageLoadRef = useRef(null);

    const handleChange = e => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const loadFile = () => {
        if (typeof window.FileReader !== 'function') {
            alert("The file API isn't supported on this browser yet.")
            return;
        }
        let input = document.getElementById("fileinput");
        if (!input)
            console.error("Couldn't find the input element");
        else if (!input.files)
            console.error("Input files error");
        else if (!input.files[0])
            alert("Please select file first")
        else {
            const selectedFile = input.files[0];

            input.files = null; // Enables the onChange event to fire next time
            input.value = '';

            console.log("Selected file: ", selectedFile)

            let fileReader = new FileReader();
            fileReader.onload = e => {
                const parseImage = async () => {
                    const result = await worker.recognize(e.target.result);
                    console.log("Got result: ", result)
                    const parsedResult = parseImageResult(result.data)
                    setState({ parsedResult, image: e.target.result })
                }

                parseImage()
                // imageParser.create({ data: e.target.result })
                //     .then(res => {
                //         console.log("Got result: ", res)
                //     })
                //     .catch(err => {
                //         console.log("ERROR: ", err)
                //     })
            }
            fileReader.readAsDataURL(selectedFile);
        }
    }

    let loaderIndicator;
    if (workerLoadProgress !== 0 && workerLoadProgress < 1) {
        loaderIndicator = (
            <div className={classes.progressDiv}>
                <CircularProgress color="primary" variant="indeterminate" />
                <LinearProgress color="primary" variant="determinate" value={workerLoadProgress * 100} />
            </div>
        )
    }

    return (
        <Dialog open={modalOpen} onClose={onClose}>
            <DialogContent>
                <Button variant="contained" color="primary" onClick={() => {
                    if (imageLoadRef && imageLoadRef.current)
                        imageLoadRef.current.click()
                }}
                    disabled={!Boolean(worker)}>
                    Load image
            </Button>
                <div>
                    <TextField label="IBAN" name="iban" value={state.iban} onChange={handleChange} />
                </div>
                <div>
                    <TextField label="Saaja" name="saaja" value={state.saaja} onChange={handleChange} />
                </div>
                <div>
                    <TextField label="Euro" name="euro" value={state.euro} onChange={handleChange} />
                </div>
                <div>
                    <TextField label="Viite" name="viite" value={state.viite} onChange={handleChange} />
                </div>
                <div>
                    <TextField label="Eräpäivä" name="dueDate" value={state.dueDate} onChange={handleChange} />
                </div>
                {loaderIndicator}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={onAdd}>Add</Button>
                <input type='file' id='fileinput' style={{ display: 'none' }}
                    accept=".bmp, .jpg, .png, .pbm, .pdf"
                    ref={imageLoadRef} onChange={() => loadFile()} />
            </DialogActions>
        </Dialog>
    )
}

export default SessionModal