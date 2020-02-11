// import { foodService } from '../api'

// TODO implement auto filtering on main types based on last eaten

const foodState = {
	filters: {
		main: {},
		side: {},
		speed: {$lt: 180},
		day: {}
	},
	search: "",
	searchOptions: [],
	sort: {},
	page: 0,
	limit: 10,
	selectedFood: null,
	foodEdit: null,
	foodEditOpen: false,
	foods: {
		data: []
	},
	filtersOpen: false,
	distincts: {},
	errors: [],
	latestFood: null,
}

export default (state = foodState, action) => {
	switch (action.type) {
		case "SET_FILTERS":
			return Object.assign({}, state, { filters: action.filters })
		case "SELECT_FOOD":
			return Object.assign({}, state, { selectedFood: action.food })
		case "EDIT_FOOD":
			const isOpen = state.foodEditOpen;
			if (isOpen) return Object.assign({}, state, { foodEdit: null, foodEditOpen: false })
			return Object.assign({}, state, { foodEdit: action.food, foodEditOpen: true })
		case "SET_FOODS":
			const newState = action.foods
			return Object.assign({}, state, {
				foods: newState.foods,
				filters: newState.filters,
				sort: newState.sort,
				search: newState.search,
				page: newState.page,
				limit: newState.limit
			})
		case "SET_OPEN_FILTERS":
			const open = state.filtersOpen;
			return Object.assign({}, state, { filtersOpen: !open })
		case "SET_DISTINCTS":
			return Object.assign({}, state, { distincts: action.res })
		case "SET_ERRORS":
			return Object.assign({}, state, { errors: action.errors })
		case "SET_LATEST_FOOD":
			return Object.assign({}, state, { latestFood: action.food })
		case "SET_SEARCH_OPTIONS":
			return Object.assign({}, state, { searchOptions: action.options})
		default:
			return state
	}
}