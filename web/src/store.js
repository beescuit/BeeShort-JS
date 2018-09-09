import axios from 'axios'
import { createStore } from 'redux'
import reducer from './reducer'
import { loadState, saveState } from './localStorage'

const laststate = loadState()
const store = createStore(reducer, laststate)

// Update click count
const state = store.getState()
state.map(item => {
  item.clicks = -1
  return item
})

axios.post('/status', { list: state })
  .then(res => {
    store.dispatch({ type: 'UPDATE', payload: res.data })
  })

store.subscribe(() => { saveState(store.getState()) })

export default store
