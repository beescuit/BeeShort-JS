function reducer (state = [], action) {
  switch (action.type) {
    case 'SHORTEN':
      return state.concat(action.payload)
    case 'UPDATE':
      return action.payload
    default:
      return state
  }
}

export default reducer
