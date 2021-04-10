const paymentState = {
	data: null,
	deleteId: null,
    distinctNotes: []
}

export default (state = paymentState, action) => {
	switch (action.type) {
		case "SET_DATA":
			return Object.assign({}, state, { data: action.data })
		case "SET_DELETE_ID":
			return Object.assign({}, state, { deleteId: action.id })
        case "SET_DISTINCT_NOTES":
            return Object.assign({}, state, { distinctNotes: action.notes })
		default:
			return state;
	}
}

