const foods = require('./foods-service/foods.service.js');
const shoplist = require('./shoplist-service/shoplist.service.js');
const users = require('./users-service/users.service.js');
const payments = require('./payments-service/payments.service');
const categoryTypes = require('./category-types-service/category-types.service');
const categories = require('./categories-service/categories.service');
const transactions = require('./transactions-service/transactions.service');

module.exports = function (app) {
	app.configure(foods);
	app.configure(shoplist);
	app.configure(users);
    app.configure(payments);
    app.configure(categoryTypes);
    app.configure(categories);
    app.configure(transactions);
};