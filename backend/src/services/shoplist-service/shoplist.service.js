const { Shoplist } = require('./shoplist.class');
const createModel = require('../../models/shoplist.model');
const hooks = require('./shoplist.hooks');

module.exports = function (app) {
	const shoplist = createModel(app);

	const options = {
		Model: shoplist,
		paginate: {
			default: 100,
			max: 100,
		},
	};

	// Initialize our service with any options it requires
	app.use('/v1/shoplist', new Shoplist(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service('/v1/shoplist');

	service.hooks(hooks);
}
