import React, { useState } from 'react'

import SwipeableViews from 'react-swipeable-views';
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    hiddenTabRoot: {
        visibility: "collapse",
        minHeight: "0px",
        height: "0px"
    },
}))

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

const TabProps = index => ({
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
})

const SwibeTabs = props => {
    const classes = useStyles()
    const { panels, hideTabs, tabProps } = props;
    const [tabValue, setTabValue] = useState(0)


    const tabClasses = hideTabs ? { classes: { root: classes.hiddenTabRoot } } : {};
    return (
        <>
            <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}
                {...tabClasses} {...tabProps}>
                {[...Array(panels.length).keys()].map(i => (
                    <Tab label={`Tab-${i}`} {...TabProps(0)} />
                ))}
            </Tabs>
            <SwipeableViews index={tabValue} onChangeIndex={i => setTabValue(i)}>
                {panels.map((panelContent, index) => (
                    <TabPanel value={tabValue} index={index}>
                        {panelContent}
                    </TabPanel>
                ))}
            </SwipeableViews>
        </>
    )
}

export default SwibeTabs