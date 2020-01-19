const { Foods } = require('./foods.class');
const createModel = require('../../models/foods.model');
const hooks = require('./foods.hooks');

module.exports = function (app) {
	const foods = createModel(app);

	const options = {
		Model: foods,
		paginate: {
			default: 10,
			max: 1000,
		},
	};

	// Initialize our service with any options it requires
	app.use('/v1/foods', new Foods(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service('/v1/foods');

	service.hooks(hooks);
}
