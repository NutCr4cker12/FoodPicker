const { Forbidden } = require('@feathersjs/errors');

module.exports.allowOnlyRoles = (...allowedRoles) => {
	return hook => {
		if (!hook.params.provider) return

		const user = hook.params.user;
		if (!user) throw new Forbidden("Access restricted")

        if (allowedRoles.includes(user.role))
            return; // Allowed

		throw new Forbidden("Access restricted")
	}
}