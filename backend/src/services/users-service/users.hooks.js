const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const { Forbidden } = require('@feathersjs/errors');

const restrict = (hook) => {
	if (!hook.params.provider) return

	const user = hook.params.user;
	if (!user || user.role !== "admin" || user.role !== "user") {
		throw new Forbidden("Access restricted")
	}
}

const checkPwd = (hook) => {
	if (hook.data.password != null) {
		return hashPassword('password')(hook)
	}
}

module.exports = {
	before: {
		all: [authenticate('jwt')],
		find: [],
		get: [],
		create: [checkPwd, restrict],
		update: [restrict],
		patch: [checkPwd, restrict],
		remove: [restrict]
	},
	after: {
		all: [protect('password')],
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
