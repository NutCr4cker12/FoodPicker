const { Binance } = require('./binance.class');
const hooks = require('./binance.hooks');

module.exports = function (app) {
	// Initialize our service with any options it requires
	app.use('/v1/binance', new Binance());

	// Get our initialized service so that we can register hooks
	const service = app.service('/v1/binance');

	service.hooks(hooks);
}
