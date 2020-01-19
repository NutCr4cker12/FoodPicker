const foods = require('./foods-service/foods.service.js');
const shoplist = require('./shoplist-service/shoplist.service.js');
const users = require('./users-service/users.service.js');
const payments = require('./payments-service/payments.service');

module.exports = function (app) {
	app.configure(foods);
	app.configure(shoplist);
	app.configure(users);
	app.configure(payments);
};