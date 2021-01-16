import React, { useState, useEffect } from 'react'

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
        labelManagerOpen : true,
    })


    useEffect(() => {

    }, [])

    
    return <div className={classes.root}>
        <Button 
            className={classes.floatRightBtn}        
            variant="contained"
            color="primary"
            onClick={() => {
                browserHistory.push('/categories')
            }}>
                Manage categories
            </Button>
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