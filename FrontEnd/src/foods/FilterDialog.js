import React from 'react'

import {
    Dialog,
    DialogActions,
    Button,
    DialogTitle,
    DialogContent,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider
} from '@material-ui/core';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    padded: {
        padding: theme.spacing(2)
    },
    margin: {
        margin: theme.spacing(1)
    }
}))

const FilterDialog = props => {
    const classes = useStyles()
    const { open, onClose, title, sort, filters, filterType, setFilters } = props
    const type = open ? filters[filterType] : {}

    const onSelectAll = () => {
        Object.keys(type).forEach(x => {
            filters[filterType][x] = "$in"
        })
        setFilters(filters, sort)
    }

    const sorted = typeof (title) === "string" ? sort[title.toLowerCase()] : false
    const isAsc = sorted && sorted > 0
    const isDesc = sorted && sorted < 0

    const handleSortChange = (name) => {
        if (!sorted) sort[name] = 1
        else if (isAsc) sort[name] = -1
        else delete sort[name]
        setFilters(filters, sort)
    }

    const BasicContent = () => (
        Object.keys(type).map(x => (
            <FormControlLabel
                key={x}
                label={x.toUpperCase()}
                control={
                    <Checkbox
                        color="primary"
                        checked={type[x] === "$in"}
                        onChange={() => {
                            filters[filterType][x] = type[x] === "$in" ? "$nin" : "$in";
                            setFilters(filters, sort);
                        }} />}
            />
        ))
    )

    const CookTimeContent = () => (
        [
            { label: "< 30 min", value: 30 },
            { label: "< 60 min", value: 60 },
            { label: "< 90 min", value: 90 },
            { label: "< 180 min", value: 180 },
        ].map(x => (
            <FormControlLabel
                key={x.label}
                label={x.label}
                control={
                    <Checkbox
                        color="primary"
                        checked={filters.speed["$lt"] >= x.value}
                        onChange={() => {
                            filters.speed = { $lt: x.value }
                            setFilters(filters, sort)
                        }} />
                }
            />
        ))
    )

    const isCookingTime = title === "Cooking Time"

    return (
        <Dialog open={open} onClose={() => onClose(filters, sort)} maxWidth={"xs"} >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent >
                {!isCookingTime &&
                    <>
                        <Button color="primary" variant="outlined" onClick={onSelectAll} className={classes.margin} >
                            Select All
                        </Button>
                        <Divider className={classes.margin} />
                    </>
                }
                <FormControl component="fieldset" className={classes.padded} >
                    <FormGroup>
                        {isCookingTime ? <CookTimeContent /> : <BasicContent />}
                    </FormGroup>
                </FormControl>
                <Divider className={classes.margin} />
                <Button
                    color="primary"
                    variant={sorted ? "contained" : "outlined"}
                    endIcon={isAsc ? <ArrowUpwardIcon /> : (isDesc ? <ArrowDownwardIcon /> : null)}
                    onClick={() => handleSortChange(title.toLowerCase())}
                >
                    Sort by
                </Button>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => onClose(filters, sort)}>
                    close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilterDialog