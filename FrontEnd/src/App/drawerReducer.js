const drawerState = { open: false }

export default (state = drawerState, action) => {
  switch (action.type) {
    case 'OPEN_DRAWER':
      return { open: true }
    case 'CLOSE_DRAWER':
      return { open: false }
    default:
      return state
  }
}
