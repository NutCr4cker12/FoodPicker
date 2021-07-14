import React from 'react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors'

const defaultTheme = createMuiTheme({})

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
	},
    monitor: {
        paper: {
            width: `calc(100% - ${defaultTheme.spacing(3)})`,
            margin: defaultTheme.spacing(2),
            padding: defaultTheme.spacing(1),
            backgroundColor: "#333",
            color: "#fff",
        },
        floatRight: {
            float: "right"
        },
        background: {
            background: "#121212",
            color: "#fff",
        },
        lightBackground: {
            backgroundColor: "#333",
            color: "#fff",
        }
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
