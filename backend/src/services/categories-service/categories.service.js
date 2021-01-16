const { Categories } = require('./categories.class');
const createModel = require('../../models/categories.model');
const hooks = require('./categories.hooks');

module.exports = function (app) {
  const categories = createModel(app);

  const options = {
    Model: categories,
    paginate: {
      default: 100,
      max: 100,
    },
  };

  // Initialize our service with any options it requires
  app.use('/v1/categories', new Categories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('/v1/categories');

  service.hooks(hooks);
}