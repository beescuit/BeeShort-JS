import React from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Popover } from '@material-ui/core'
import { lightBlue } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/core/styles'
import Clipboard from 'react-clipboard.js'

const mapStateToProps = state => {
  return { history: state }
}

const style = {
  head: {
    fontSize: '14.5px',
    color: 'black'
  },
  url: {
    color: lightBlue[600],
    textDecoration: 'none'
  },
  shortUrl: {
    padding: '5px 10px 5px 10px',
    background: '#616161',
    width: 'fit-content',
    border: 0,
    borderRadius: '10px',
    margin: 0,
    color: 'white',
    cursor: 'pointer'
  },
  popper: {
    padding: '0 20px'
  }
}

class ConnectedH extends React.Component {
  constructor () {
    super()
    this.state = {
      anchorEl: null
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClick (event) {
    console.log(event)
    this.setState({ anchorEl: event.trigger })
  }

  handleClose () {
    this.setState({ anchorEl: null })
  }

  render () {
    if (this.props.history.length > 0) {
      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={this.props.classes.head}>Short URL</TableCell>
              <TableCell className={this.props.classes.head}>Long URL</TableCell>
              <TableCell className={this.props.classes.head}>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.history.slice().reverse().map((item, i) => {
              return (
                <TableRow key={item.short}>
                  <TableCell>
                    <Clipboard
                      data-clipboard-text={window.location.href + item.short}
                      className={this.props.classes.shortUrl}
                      onSuccess={this.handleClick}>
                      {window.location.href + item.short}
                    </Clipboard>
                    <Popover
                      id='simple-popper'
                      open={Boolean(this.state.anchorEl)}
                      anchorEl={this.state.anchorEl}
                      onClose={this.handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                      }}
                    >
                      <p className={this.props.classes.popper}>Copied to clipboard.</p>
                    </Popover>
                  </TableCell>
                  <TableCell><a className={this.props.classes.url} href={item.url}>{item.url}</a></TableCell>
                  <TableCell>{(item.clicks === -1) ? <CircularProgress size={30} /> : item.clicks}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )
    } else {
      return null
    }
  }
}

const History = connect(mapStateToProps)(withStyles(style)(ConnectedH))

export default History
