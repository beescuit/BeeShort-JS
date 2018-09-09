import React from 'react'
import { Provider } from 'react-redux'
import store from '../store'

import Inputs from './Inputs.js'
import History from './History.js'

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <div>
          <h1 className='logo'>BeeShort-JS!</h1>
          <Inputs />
          <History />
        </div>
      </Provider>
    )
  }
}

export default App
