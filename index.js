let express = require('express');
let app = express();

// Set Public static folder
app.use(express.static(__dirname + '/public'));

// User View Engine
let expressHbs = require('express-handlebars');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Define your routes here

app.use('/', require("./routes/indexRouter"));
app.use('/products', require("./routes/productRouter"));

app.get('/sync', (req, res) => {
    let models = require('./models');
    models.sequelize.sync().then(() => {
        res.send("aromadb is synced successfully.");
    });
});

app.get('/:page', (req, res) => {
    let banners = {
        blog: 'Our Blog',
        cart: 'Shopping Cart',
        category: 'Shop Category',
        checkout: 'Product Checkout',
        confirmation: 'Order Confirmation',
        contact: 'Contact Us',
        login: 'Login / Register',
        register: 'Register',
        single_blog: 'Blog Details',
        single_product: 'Shop Single',
        tracking_order: 'Order Tracking'
    }
    let page = req.params.page;

    res.render(page, { banner: banners[page] });
});




// Set server port and start server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`);
});