export default (state = {}, action) => {
	switch (action.type) {
	  case 'AUTH':
		return action.user
	  case 'DEAUTH':
		return {}
	  default:
		return state
	}
  }
  