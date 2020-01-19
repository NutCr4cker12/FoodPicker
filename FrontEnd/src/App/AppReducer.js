export default (state = {message: "", err: ""}, action) => {
	switch (action.type) {
		case "SET_MESSAGE":
			return {message: action.message, err: ""}
		case "SET_ERROR":
			return {message: "", err: action.message}
		default:
			return state
	}
}