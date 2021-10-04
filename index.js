let express = require('express');
let app = express();

// Set Public static folder
app.use(express.static(__dirname + '/public'));

// User View Engine
let expressHbs = require('express-handlebars');
let helper = require('./controllers/helper');
let paginateHelper = require('express-handlebars-paginate');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        createStarList: helper.createStarList,
        createStars: helper.createStars,
        createTopProductList: helper.createTopProductList,
        createPagination: paginateHelper.createPagination
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Use Body parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Use Cookie-parser
let cookieParser = require('cookie-parser');
app.use(cookieParser());

// Use Session
let session = require('express-session');
app.use(session({
    cookie: { httpOnly: true, maxAge: 30*24*60*60*1000},
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false
}));

// Use Cart Controller
let Cart = require('./controllers/cartController');
app.use((req, res, next)=>{
    let cart = new Cart(req.session.cart? req.session.cart: {});
    req.session.cart =cart;
    res.locals.totalQuantity = cart.totalQuantity;
    next();
})

// Define your routes here

app.use('/', require("./routes/indexRouter"));
app.use('/products', require("./routes/productRouter"));
app.use('/cart', require('./routes/cartRouter'));
app.use('/comments', require('./routes/commentRouter'));
app.use('/reviews', require('./routes/reviewRouter'));

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