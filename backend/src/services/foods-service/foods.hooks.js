const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-mongodb-fuzzy-search')
const { allowOnlyRoles } = require('../restrict');

const parseSearch = (hook) => {
	var q = hook.params.query;
	if (q.$regex) {
		q.name = q.$regex;
		delete q.$regex;
	}
	if (q.$lasteaten) {
		hook.params.$lasteaten = true;
		delete q.$lasteaten
	}
}

const getHighestDate = (food) => {
	return new Date(food.lasteaten.sort((a, b) => new Date(b) - new Date(a))[0])
}

const parseLastEaten = hook => {
	if (!hook.params.$lasteaten) return

	const data = hook.result.data.filter(f => f.lasteaten)
	var last = data.sort((a, b) => {
		var firstA = getHighestDate(a)
		var firstB = getHighestDate(b)
		return firstB - firstA
	})[0]
	const latest = getHighestDate(last)
	data.forEach(food => {
		if (getHighestDate(food) > latest) last = food;
	})
	hook.result = last;
}
module.exports = {
	before: {
		all: [
			authenticate('jwt'),
			search({
				fields: ["name"]
			})
		],
		find: [parseSearch],
		get: [],
		create: [allowOnlyRoles("admin", "user")],
		update: [allowOnlyRoles("admin", "user")],
		patch: [allowOnlyRoles("admin", "user")],
		remove: [allowOnlyRoles("admin", "user")]
	},
	after: {
		all: [],
		find: [parseLastEaten],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},
	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
