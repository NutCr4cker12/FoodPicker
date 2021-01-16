const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-mongodb-fuzzy-search')
const { Forbidden } = require('@feathersjs/errors');
const { allowOnlyRoles } = require('../restrict');

const parseSearch = (hook) => {
	var q = hook.params.query;
	if (q.$regex) {
		q.name = { $regex: new RegExp(q.$regex, 'i')};
		delete q.$regex;
	}
}


module.exports = {
	before: {
		all: [
            authenticate('jwt'),
            allowOnlyRoles("admin", "user"),
            search({
                fields: ["name"]
            }),
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
