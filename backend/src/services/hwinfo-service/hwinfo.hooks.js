const { authenticate } = require('@feathersjs/authentication').hooks;
const { MethodNotAllow } = require('@feathersjs/errors')
const { allowOnlyRoles } = require('../restrict');

module.exports = {
	before: {
		all: [
			authenticate('jwt'),
			allowOnlyRoles("admin")
		],
		find: [],
		get: [],
		create: [MethodNotAllow],
		update: [MethodNotAllow],
		patch: [MethodNotAllow],
		remove: [MethodNotAllow]
	},
	after: {
		all: [],
		find: [],
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
