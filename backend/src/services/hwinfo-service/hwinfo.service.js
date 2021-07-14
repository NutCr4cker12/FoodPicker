const { HWinfo } = require('./hwinfo.class');
const createModel = require('../../models/hwinfo.model');
const hooks = require('./hwinfo.hooks');

module.exports = function (app) {
	const hwinfoModel = createModel(app);

	const options = {
		Model: hwinfoModel,
		paginate: {
			default: 10,
			max: 1000,
		},
	};

	// Initialize our service with any options it requires
	app.use('/v1/hwinfo', new HWinfo(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service('/v1/hwinfo');

	service.hooks(hooks);
}
