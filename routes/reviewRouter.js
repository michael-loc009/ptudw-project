let express = require('express');
const controller = require('../controllers/categoryController');
let router = express.Router();

router.post('/', async(req, res, next) => {
    let controller = require('../controllers/reviewController');

    try {
        let review = {
            userId: 1,
            productId: req.body.productId,
            rating: req.body.rating,
            message: req.body.message
        };

        const addReview = await controller.add(review);

        res.redirect(`/products/${review.productId}`);

    } catch (error) {
        next(error);
    }
});

module.exports = router;