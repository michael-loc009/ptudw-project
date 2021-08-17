let express = require('express');
let router = express.Router();

router.get('/', async(req, res, next) => {
    let categoryController = require('../controllers/categoryController');
    let productController = require('../controllers/productController');
    let brandController = require('../controllers/brandController');
    let colorController = require('../controllers/colorController');

    try {
        const categories = await categoryController.getAll();
        const brands = await brandController.getAll();
        const colors = await colorController.getAll();
        const products = await productController.getAll();

        res.locals.categories = categories;
        res.locals.brands = brands;
        res.locals.colors = colors;
        res.locals.products = products;
        res.render('category');
    } catch (error) {
        next(error);
    }
});

router.get('/:id', (req, res) => {
    res.render('single_product');
});

module.exports = router;