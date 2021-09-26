let express = require('express');
let router = express.Router();

router.get('/', async(req, res, next) => {
    let categoryController = require('../controllers/categoryController');
    let productController = require('../controllers/productController');
    if (req.query.search == null || req.query.search.trim() == ''){
        req.query.search = '';
    }

    try {
        const categories = await categoryController.getAll(req.query);
        const trendingProducts = await productController.getTrendingProducts(8);

        res.locals.categories = categories;
        res.locals.trendingProducts = trendingProducts;
        res.render('index');
    } catch (error) {
        next(error);
    }
});

module.exports = router;