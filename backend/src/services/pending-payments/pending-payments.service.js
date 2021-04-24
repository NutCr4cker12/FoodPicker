// Initializes the `.src/services/pending-payments` service on path `/.src/services/pending-payments`
const { PendingPayments } = require('./pending-payments.class');
const createModel = require('../../models/pending-payments.model');
const hooks = require('./pending-payments.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/pending-payments', new PendingPayments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('/v1/pending-payments');

  service.hooks(hooks);
};
