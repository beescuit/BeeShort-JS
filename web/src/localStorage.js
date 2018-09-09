export const loadState = () => {
  try {
    const rawstate = localStorage.getItem('state')
    if (!rawstate) return undefined
    return JSON.parse(rawstate)
  } catch (e) {
    localStorage.clear()
    return undefined
  }
}

export const saveState = state => {
  try {
    const rawstate = JSON.stringify(state)
    localStorage.setItem('state', rawstate)
  } catch (e) {
    console.log('Error while writing state to localStorage')
  }
}
