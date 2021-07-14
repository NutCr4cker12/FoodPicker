const { NH } = require('./nh.class');
const hooks = require('./nh.hooks');

module.exports = function (app) {
	// Initialize our service with any options it requires
	app.use('/v1/nh', new NH());

	// Get our initialized service so that we can register hooks
	const service = app.service('/v1/nh');

	service.hooks(hooks);
}
