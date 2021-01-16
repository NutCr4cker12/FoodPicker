import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CategoriesContent from './CategoriesContent'
import CategoryTypeContent from './CategoryTypeContent'
import UnlabeledContent from './UnlabeledContent'
import TabContent from '../core/TabContent'

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { browserHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { setTransactions } from '../transactions/transactionActions'
import { categoriesApi, categoryTypeApi, transactionsApi } from '../api'
import { setError, setMessage } from '../App/AppActions';

const useStyles = makeStyles(theme => ({
    root: theme.root,
    marginBtn: { margin: theme.spacing(2) },
    paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(2),
        height: "100%"
    }
}))

const Categories = props => {
    const classes = useStyles()
    const [state, setState] = useState({
        tabValue: 0
    })
    const { tabValue } = state;
    const { onListTransactions, transactions, categories, categoryTypes } = props;

    console.log("foo", transactions)

    useEffect(() => {
        onListTransactions()
    }, [])

    return (
        <div className={classes.root} style={{ height: "100%" }}>
            <Button
                className={classes.marginBtn}
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                    browserHistory.push('/transactions')
                }}>
                Back
            </Button>
            <Paper className={classes.paper} elevation={4}>
                <Tabs
                    variant="fullWidth"
                    className={classes.tabs}
                    indicatorColor="primary"
                    textColor="primary"
                    value={tabValue}
                    onChange={(e, value) => setState({ ...state, tabValue: value })}
                >
                    <Tab label="Categories" />
                    <Tab label="Category types" />
                    <Tab label="Unlabeled" />
                </Tabs>
                <TabContent value={tabValue} index={0} >
                    <CategoriesContent />
                </TabContent>
                <TabContent value={tabValue} index={1} >
                    <CategoryTypeContent />
                </TabContent>
                <TabContent value={tabValue} index={2} >
                    <UnlabeledContent 
                        transactions={transactions}
                    />
                </TabContent>
            </Paper>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        transactions: state.transactions.transactions.data,
        categories: state.categories.categories,
        categoryTypes: state.categories.categoryTypes
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddCategory: (name, main, sub, sub2) => {

        },
        onEditCategory: (id, name, main, sub, sub2) => {

        },
        onListCategories: () => {

        },
        onListTransactions: () => {
            transactionsApi.list({ $limit: 10 })
                .then(res => dispatch(setTransactions(res)))
                .catch(err => dispatch(setError(err.message)))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)