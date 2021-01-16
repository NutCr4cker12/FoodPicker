const { authenticate } = require('@feathersjs/authentication').hooks;
const { allowOnlyRoles } = require('../restrict');

module.exports = {
	before: {
		all: [
            authenticate('jwt'),
            allowOnlyRoles("admin", "user"),
        ],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
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
