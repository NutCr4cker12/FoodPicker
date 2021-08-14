import React from 'react'

import { Box, Typography } from '@material-ui/core';

const TabContent = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3} {...props.boxProps}>{children}</Box>}
		</Typography>
	);
}

export default TabContent;