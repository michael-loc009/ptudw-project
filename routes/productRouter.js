let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('category');
});

router.get('/:id', (req, res) => {
    res.render('single_product');
});

module.exports = router;