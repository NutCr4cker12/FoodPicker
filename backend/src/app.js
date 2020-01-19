const path = require('path');
// const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
// const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
// const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const authentication = require('./authentication');

const mongoose = require('./mongoose');
// const sequelize = require('./sequelize');

if (process.env.NODE_ENV == 'production') {
	if (!process.env.MONGODB_URL)
		throw 'MONGO URL is not configured';
}

const app = express(feathers());

// Load app configuration
app.configure(configuration());

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
// app.use(compress());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));
//TODO: REMOVE! app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());


app.configure(mongoose);

// app.configure(sequelize);


// Configure other middleware (see `middleware/index.js`)
// app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
// app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
