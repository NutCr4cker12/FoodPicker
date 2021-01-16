import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'

const useStyles = makeStyles(theme => ({

}))

const UnlabeledContent = props => {
    const classes = useStyles()
    const { transactions } = props;

    console.log(transactions)

    return (
        <div>
            {transactions && transactions.map(t => (
                <div>
                    {t.saaja}
                </div>
            ))}
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(UnlabeledContent)