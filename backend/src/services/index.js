const users = require('./users-service/users.service.js');
const foods = require('./foods-service/foods.service.js');
const payments = require('./payments-service/payments.service');
const pendingPayments = require('./pending-payments/pending-payments.service.js');
const hwinfo = require('./hwinfo-service/hwinfo.service.js')
const binance = require('./binance-service/binance.service.js')
const nh = require('./nh-service/nh.service.js')

module.exports = function (app) {
    app.configure(users);
    app.configure(foods);
    app.configure(payments);
    app.configure(pendingPayments);
    app.configure(hwinfo)
    app.configure(binance)
    app.configure(nh)
};