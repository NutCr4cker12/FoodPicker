const { Users } = require('./users.class');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

const { hashPassword } = require('@feathersjs/authentication-local').hooks;


module.exports = function (app) {
  const user = createModel(app);

  const options = {
    Model: user,
    paginate: {
      default: 100,
      max: 100,
    },
  };

  // Initialize our service with any options it requires
  app.use('/v1/users', new Users(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('/v1/users');

  service.hooks(hooks);

  function createUser(email, password, name, role) {

    user.find({ email: email }).exec()
      .then(res => {
        //Do nothing if user already exists
        if (res.length === 0) {
          let u = new user();
          u.email = email;
          u.password = password;
          u.name = name;
          u.role = role;

          hashPassword('password')({
            type: 'before',
            app: app,
            data: u,
          }
          ).then((hook) => {
            u.password = hook.data.password;
            u.save(function (err) {
              if (err) {
                console.info(`Failed to create user ${email}:`, err.message);
              } else {
                console.info(`Created user ${email}`);
              }
            });
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

}