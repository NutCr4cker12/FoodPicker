export const setFilters = (filters) => {
	return { type: "SET_FILTERS", filters }
}

export const selectFood = (food) => {
	return { type: "SELECT_FOOD", food}
}

export const setFoods = (foods) => {
	return { type: "SET_FOODS", foods}
}

export const onSetOpenFilters = () => {
	return { type: "SET_OPEN_FILTERS"}
}

export const distincts = (res) => {
	return { type: "SET_DISTINCTS", res}
}

export const setEditFood = (food) => {
	return { type: "EDIT_FOOD", food}
}

export const setErrors = (errors) => {
	return { type: "SET_ERRORS", errors}
}

export const setLatestFood = (food) => {
	return { type: "SET_LATEST_FOOD", food}
}

export const setOptions = (options) => {
	return { type: "SET_SEARCH_OPTIONS", options }
}