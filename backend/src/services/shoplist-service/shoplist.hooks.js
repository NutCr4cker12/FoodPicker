const { authenticate } = require('@feathersjs/authentication').hooks;
const { Forbidden } = require('@feathersjs/errors');

const restrict = (hook) => {
	if (!hook.params.provider) return

	const user = hook.params.user;
	if (!user || user.role !== "admin" || user.role !== "user") {
		throw new Forbidden("Access restricted")
	}
}

module.exports = {
	before: {
	  all: [authenticate('jwt')],
	  find: [],
	  get: [],
	  create: [restrict],
	  update: [restrict],
	  patch: [restrict],
	  remove: [restrict]
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
  