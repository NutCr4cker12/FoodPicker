import React, { useState, useEffect, useRef } from 'react'

import { Button } from '@material-ui/core'

import { browserHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'

const useStyles = makeStyles(theme => ({
    root: theme.root,
    floatRightBtn: {
        float: "right",
        margin: theme.spacing(2)
    }
}))

const Transactions = props => {
    const classes = useStyles()
    const [state, setState] = useState({
        labelManagerOpen: true,
    })
    const imageLoadRef = useRef(null);


    useEffect(() => {

    }, [])

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
                const foo = async () => {
                    
                }


                foo()
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


    return <div className={classes.root}>
        <Button variant="contained" color="primary" onClick={() => {
            if (!imageLoadRef) {
                console.log("No ref")
                return;
            }
            if (!imageLoadRef.current) {
                console.log("No current")
                return;
            }
            console.log("Clicking ref")
            imageLoadRef.current.click();
        }}>
            Load image
        </Button>
        <Button
            className={classes.floatRightBtn}
            variant="contained"
            color="primary"
            onClick={() => {
                browserHistory.push('/categories')
            }}>
            Manage categories
            </Button>
        <input type='file' id='fileinput' style={{ display: 'none' }}
            accept=".bmp, .jpg, .png, .pbm"
            ref={imageLoadRef} onChange={() => loadFile()} />
    </div>
}

const mapStateToProps = (state) => {
    return {
        transactions: state.transactions
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions)