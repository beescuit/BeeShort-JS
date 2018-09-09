import './components/App.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { blue, red } from '@material-ui/core/colors'
import { Grid } from '@material-ui/core'

import App from './components/App'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    error: red
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Grid container direction='row' justify='center' alignItems='center'>
      <Grid item xs={8}>
        <App />
      </Grid>
    </Grid>
  </MuiThemeProvider>, document.getElementById('app'))
