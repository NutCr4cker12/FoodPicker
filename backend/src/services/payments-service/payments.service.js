const { Payments } = require('./payments.class')
const createModel = require('../../models/payments.model')
const hooks = require('./payments.hooks')

module.exports = function (app) {
	const payments = createModel(app);

	const options = {
		Model: payments,
		paginate: {
			default: 1000,
			max: 1000,
		},
	};

	// Initialize our service with any options it requires
	app.use('/v1/payments', new Payments(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service('/v1/payments');

	service.hooks(hooks);
}
