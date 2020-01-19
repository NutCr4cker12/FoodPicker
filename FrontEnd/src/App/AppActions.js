export const setError = message => {
	return { type: 'SET_ERROR', message }
  }

  export const setMessage = message => {
	return { type: 'SET_MESSAGE', message }
  }
  
  //////////////////////////////////////////////////////////////////////////////
  
  export const openDrawer = () => {
	return { type: 'OPEN_DRAWER' }
  }
  
  export const closeDrawer = () => {
	return { type: 'CLOSE_DRAWER' }
  }
  
  export const openProfile = (target) => {
	return { type: "OPEN_PROFILE_MENU", target }
  }
  
  export const closeProfile = () => {
	return { type: "CLOSE_PROFILE_MENU" }
  }
  
  export const authUser = user => {
	return { type: 'AUTH', user }
  }
  
  export const deauthUser = () => {
	return { type: 'DEAUTH' }
  }
  
  //////////////////////////////////////////////////////////////////////////////
  