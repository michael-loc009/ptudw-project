let express = require('express');
let router = express.Router();

router.get('/', async(req, res, next) => {
    let categoryController = require('../controllers/categoryController');
    let productController = require('../controllers/productController');

    try {
        const categories = await categoryController.getAll();
        const trendingProducts = await productController.getTrendingProducts(8);

        res.locals.categories = categories;
        res.locals.trendingProducts = trendingProducts;
        res.render('index');
    } catch (error) {
        next(error);
    }
});

module.exports = router;