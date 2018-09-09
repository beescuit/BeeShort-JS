import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Input, Button, Grid, Snackbar, SnackbarContent } from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error'
import { withStyles } from '@material-ui/core/styles'

const mapDispatchToProps = dispatch => {
  return {
    addUrl: (short, url, clicks = 0) => dispatch({ type: 'SHORTEN', payload: { short, url, clicks } })
  }
}

const style = theme => ({
  error: {
    backgroundColor: theme.palette.error[500]
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
})

class ConnectedInputs extends React.Component {
  constructor () {
    super()
    this.state = {
      url: '',
      custom: '',
      open: false,
      error: ''
    }
    this.OpenError = this.OpenError.bind(this)
    this.UrlChangeHandle = this.UrlChangeHandle.bind(this)
    this.CustomUrlChangeHandle = this.CustomUrlChangeHandle.bind(this)
    this.shorten = this.shorten.bind(this)
    this.HandleClose = this.HandleClose.bind(this)
  }
  render () {
    return (
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <Input placeholder='https://your.website/' fullWidth value={this.state.url} onChange={this.UrlChangeHandle} />
        </Grid>
        <Grid item xs={4}>
          <Input placeholder='Custom url' fullWidth value={this.state.custom} onChange={this.CustomUrlChangeHandle} />
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' color='primary' onClick={this.shorten}>Shorten</Button>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.HandleClose}
        >
          <SnackbarContent
            onClose={this.handleClose}
            className={this.props.classes.error}
            message={
              <span className={this.props.classes.message}>
                <ErrorIcon />
                {this.state.error}
              </span>
            }
          />
        </Snackbar>
      </Grid>
    )
  }
  HandleClose () {
    this.setState({ open: false })
  }
  OpenError (error) {
    this.setState({ error, open: true })
  }
  UrlChangeHandle (event) {
    this.setState({ url: event.target.value })
  }
  CustomUrlChangeHandle (event) {
    this.setState({ custom: event.target.value })
  }
  shorten () {
    const { url, custom } = this.state
    axios.post('/short', { url, custom }).then(res => {
      if (res.data.err) return this.OpenError(res.data.err)
      const short = res.data.data.shorturl
      this.props.addUrl(short, url)
    })
  }
}

const Inputs = connect(null, mapDispatchToProps)(withStyles(style)(ConnectedInputs))

export default Inputs
