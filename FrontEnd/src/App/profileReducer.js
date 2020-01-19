const profileMenuState = { open: false, anchor: null }

export default (state = profileMenuState, action) => {
    switch (action.type) {
        case 'OPEN_PROFILE_MENU':
            return { open: true, anchor: action.target}
        case 'CLOSE_PROFILE_MENU':
            return { open: false, anchor: null }
        default:
            return state
    }
}
