const { query } = require('express');
let express = require('express');
let router = express.Router();

router.get('/', async(req, res, next) => {
    let categoryController = require('../controllers/categoryController');
    let productController = require('../controllers/productController');
    let brandController = require('../controllers/brandController');
    let colorController = require('../controllers/colorController');

    if (req.query.category == null || isNaN(req.query.category)) {
        req.query.category = 0;
    }

    if (req.query.brand == null || isNaN(req.query.brand)) {
        req.query.brand = 0;
    }

    if (req.query.color == null || isNaN(req.query.color)) {
        req.query.color = 0;
    }

    if (req.query.min == null || isNaN(req.query.min)) {
        req.query.min = 0;
    }

    if (req.query.max == null || isNaN(req.query.max)) {
        req.query.max = 100;
    }

    if (req.query.sort == null) {
        req.query.sort = 'name';
    }

    if (req.query.limit == null || isNaN(req.query.limit)) {
        req.query.limit = 9;
    }

    if (req.query.page == null || isNaN(req.query.page)) {
        req.query.page = 1;
    }

    if (req.query.search == null || req.query.search.trim() == '') {
        req.query.search = '';
    }

    try {
        const categories = await categoryController.getAll(req.query);
        const brands = await brandController.getAll(req.query);
        const colors = await colorController.getAll(req.query);
        const products = await productController.getAll(req.query);
        const trendingProducts = await productController.getTrendingProducts(12);


        res.locals.categories = categories;
        res.locals.brands = brands;
        res.locals.colors = colors;
        res.locals.products = products;
        res.locals.topProducts = trendingProducts;
        res.locals.pagination = {
            page: parseInt(req.query.page),
            limit: parseInt(req.query.limit),
            totalRows: products.count
        };

        res.render('category');
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async(req, res, next) => {
    let productController = require('../controllers/productController');
    let reviewController = require('../controllers/reviewController');
    try {
        const product = await productController.getById(req.params.id);
        const trendingProducts = await productController.getTrendingProducts(12);
        const review = await reviewController.getUserReviewProduct(1,req.params.id);

        res.locals.product = product;
        res.locals.topProducts = trendingProducts;
        res.locals.userReview = review;
        
        res.render('single_product');
    } catch (error) {
        next(error);
    }
});

module.exports = router;