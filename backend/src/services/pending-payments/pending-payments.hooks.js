const { authenticate } = require('@feathersjs/authentication').hooks;
// const { disallow } = require('feathers-hooks-common');
const { allowOnlyRoles } = require('../restrict');
const { Forbidden } = require('@feathersjs/errors');

const restrictGetAfter = async hook => {
    if (!hook.params.provider)
        return;

    const res = hook.result;
    if (res && !res.isMarked && res.ids) {
        for (let i = 0; i < res.ids.length; i++) {
            await hook.app.service("v1/payments").patch(res.ids[i], { paid: true })
        }
        await hook.app.service("v1/pending-payments").patch(res._id, { isMarked: true })
        hook.result = null;
    } else if (res && res.isMarked) {
        hook.result = { alreadyMarked: true }
    } else {
        hook.result = null;
    }
    return hook;
}

const restrictPatch = async hook => {
    if (!hook.params.provider)
        return;
    return new Forbidden("Method not allowed");
}

module.exports = {
  before: {
    all: [],
    find: [
        authenticate('jwt'),
		allowOnlyRoles("admin")
    ],
    get: [],
    create: [
        authenticate('jwt'),
		allowOnlyRoles("admin")
    ],
    update: [Forbidden],
    patch: [restrictPatch],
    remove: [
        authenticate('jwt'),
		allowOnlyRoles("admin")
    ],
  },

  after: {
    all: [],
    find: [],
    get: [restrictGetAfter],
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
