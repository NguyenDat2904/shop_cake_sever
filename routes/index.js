const home = require('./home.route');
const auth = require('./auth.route');
const user = require('./users.route');
const order = require('./order.route');
const product = require('./product.route');
const cart = require('./cart.route');
const contact = require('./contact.route');
const payment = require('./payment.route');

function router(app) {
    // Setup SUCCESS
    app.use('/', home);

    // 0. auth
    app.use('/auth', auth);

    // 1. user
    app.use('/user', user);

    // 2. products
    app.use('/product', product);

    // 3. carts
    app.use('/cart', cart);

    // 4. orders
    app.use('/order', order);

    // 5. contacts
    app.use('/contact', contact);

    // 6. payment
    app.use('/payment', payment);
}

module.exports = router;
