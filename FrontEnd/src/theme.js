import React from 'react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors'

const muiTheme = createMuiTheme({
	palette: {
		// primary: green,
		primary: {
			main: green[800]
		},
		secondary: {
			main: "#fffffF"
		},
		error: red
	},
	overrides: {
		MuiPaper: {
			root: {
				// flex: 1,
				flexBasis: "auto",
			}
		},
		MuiTabs: {
			vertical: {
				maxWidth: "80px"
			}
		},
		MuiGrid: {
			root: {
				justifyContent: "space-evenly"
			}
		},
		MuiDialogTitle: {
			root: {
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between"		
			}
		}
	},
	separate: {
		flexGrow: 1
	},
	root: {
		marginTop: "4rem"
	},
	centerDivColumn: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	spreadDivColumn: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	}
})


export const AppTheme = (props) => {

	return (
		<ThemeProvider theme={muiTheme}>
			<div>
				{props.children}
			</div>
		</ThemeProvider>
	)
}
