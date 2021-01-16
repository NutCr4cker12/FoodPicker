import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'

const useStyles = makeStyles(theme => ({

}))

const CategoriesContent = props => {
    const classes = useStyles()

    return (
        <div>
            CategoriesContent
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesContent)