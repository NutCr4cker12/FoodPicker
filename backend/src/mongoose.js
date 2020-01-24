const mongoose = require('mongoose');
// const logger = require('./logger');

module.exports = function (app) {
  mongoose.connect(
    process.env.MONGODB_URL,
    { useCreateIndex: true, useNewUrlParser: true }
  ).catch(err => {
    console.error(err);
    process.exit(1);
  });
  
  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
