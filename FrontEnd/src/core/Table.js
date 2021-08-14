import React from 'react';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Tooltip,
    Fab,
    IconButton,
    Menu,
    MenuItem
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import combineDates from './combineDates';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    toolBar: {
        justifyContent: "space-between"
    },
    toolBarTitle: {
        display: "flex",
        alignItems: "center"
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    button: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        minWidth: "133px",
    }
}));


const MyTable = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { columns, data, sort, setSort, limit, setLimit, onSelectFood, onAddFood, page, setPage, setFilterOpen, clearFilters } = props;
    if (!data) return (
        <div />
    )

    const foods = data.data
    const count = data.total || 0;
    const pager = count === 0 ? 0 : page;

    const handleChange = (name) => {
        const value = sort[name]
        if (!value) sort[name] = 1
        else if (value > 0) sort[name] = -1
        else delete sort[name]
        setSort(sort)
    }

    const ClearFiltersMenu = () => (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => {
                clearFilters()
                setAnchorEl()
            }}>
                Clear Filters
            </MenuItem>
        </Menu>
    )

    const getSortDirection = name => {
        const value = sort[name]
        if (!value) return false;
        if (value > 0) return "asc"
        return "desc"
    }

    const SortableHeader = ({ headerName }) => (
        <TableSortLabel
            active={Boolean(sort[headerName])}
            direction={getSortDirection(headerName) || "asc"}
            onClick={(e) => {
                e.preventDefault()
                handleChange(headerName)
            }}
        >
            {headerName}
        </TableSortLabel>
    )

    const FilterableHeader = ({ headerName }) => (
        <TableSortLabel
            active={Boolean(sort[headerName])}
            direction={getSortDirection(headerName) || "asc"}
            onClick={() => setFilterOpen(headerName)}
        >
            {headerName}
            <MoreVertIcon style={{ opacity: "0.4" }} />
        </TableSortLabel>
    )

    const tableHeaders = (
        <TableHead>
            <TableRow>
                {columns.map((name, i) => (
                    <TableCell key={i}
                        className={classes.root}
                        align={"left"}
                        padding="none"
                        sortDirection={getSortDirection(name)}
                    >
                        {props.columnNameToFilter[name] ?
                            <FilterableHeader headerName={name} /> :
                            <SortableHeader headerName={name} />}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )

    const tableBody = (
        <TableBody>
            {foods.map((d, i) => (
                <TableRow
                    key={i}
                    hover
                    onClick={(e) => {
                        e.preventDefault()
                        onSelectFood(d)
                    }}
                >
                    <TableCell >{d.maintype}</TableCell >
                    <TableCell >{d.sidetype.join(", ")}</TableCell>
                    <TableCell >{d.name}</TableCell>
                    <TableCell >{d.timeseaten}</TableCell>
                    <TableCell >
                        {d.lasteaten && d.lasteaten.length ? combineDates(d.lasteaten.map(x => new Date(x)), 1)[0].split(" - ")[0] : ""}
                    </TableCell>
                    <TableCell >{d.time}</TableCell>
                    <TableCell >{d.foodamount}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    )

    return (
        <div>
            <Toolbar className={classes.toolBar}>
                <div className={classes.toolBarTitle}>
                    <IconButton onClick={e => setAnchorEl(e.currentTarget)}
                        style={{ padding: "0px" }}
                    >
                        <MoreVertIcon style={{ opacity: "0.4" }} />
                    </IconButton>
                    <Typography variant="h6" id="tableTitle">
                        Foods
                    </Typography>
                </div>
                <Tooltip title="Add New Food">
                    <Fab color="primary" size="medium" onClick={() => onAddFood()}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Toolbar >
            <ClearFiltersMenu />
            <TableContainer>
                <Table size={'medium'} >
                    {tableHeaders}
                    {tableBody}
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={count}
                rowsPerPage={limit}
                onChangeRowsPerPage={e => setLimit(e.target.value)}
                rowsPerPageOptions={[10, 20, 40, 50]}
                page={pager}
                onChangePage={(e, newPage) => {
                    e.preventDefault()
                    setPage(newPage)
                }}
            />
        </div>
    )
}
export default MyTable