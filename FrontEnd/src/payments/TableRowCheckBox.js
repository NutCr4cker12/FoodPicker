import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel, Tooltip } from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const useStyles = makeStyles(theme => ({

}))

// mailed and paid --> Disabled and checked
// mailed but pending --> Custom icon
// not mailed and no pdf --> disabled
// not mailed and pdf --> normal 

const TableRowCheckBox = props => {
    const classes = useStyles()
    const { rowData, onChange, toMailList } = props;

    const mailedAndPaid = rowData.mailed && rowData.paid;
    const mailedAndPending = rowData.mailed && rowData.paid === false;
    const notMailedNoPDF = !rowData.mailed && rowData.imageData == null;

    let component, toolTipText;
    if (mailedAndPaid) {
        toolTipText = "Mailed and paid";
        component = <Checkbox disabled checked icon={<DoneAllIcon />} color="primary" />
    }
    else if (mailedAndPending) {
        toolTipText = "Mailed and pending";
        component = <Checkbox
            icon={<HourglassEmptyIcon />}
            checkedIcon={<HourglassFullIcon />}
            checked={toMailList.find(x => x._id === rowData._id) != null}
            color="primary"
            onChange={onChange}
        />
    }
    else if (notMailedNoPDF) {
        toolTipText = "Missing pdf - cant mail";
        component = <Checkbox disabled checked={false} color="primary" />
    } else {
        toolTipText = "Not mailed";
        component = <Checkbox
            color="primary"
            onChange={onChange}
            checked={toMailList.find(x => x._id === rowData._id) != null}
        />
    }

    return (
        <Tooltip title={toolTipText}>
            <span>
                {component}
            </span>
        </Tooltip>
    )
}

export default TableRowCheckBox