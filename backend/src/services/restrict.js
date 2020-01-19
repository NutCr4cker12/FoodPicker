const { Forbidden } = require('@feathersjs/errors');

module.exports.allowOnlyRoles = (...allowedRoles) => {
	return hook => {
		return hook;
		if (!hook.params.provider) return

		const user = hook.params.user;
		if (!user) throw new Forbidden("Access restricted")

		allowedRoles.forEach(x => {
			if (user.role === x) return
		})

		throw new Forbidden("Access restricted")
	}
}