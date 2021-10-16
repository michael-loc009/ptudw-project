let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');
let reviewController = require('../controllers/reviewController');
router.post('/', userController.isLoggedIn, async(req, res, next) => {
    

    try {
        let review = {
            userId: req.session.user.id,
            productId: req.body.productId,
            rating: req.body.rating,
            message: req.body.message
        };

        const addReview = await reviewController.add(review);

        res.redirect(`/products/${review.productId}`);

    } catch (error) {
        next(error);
    }
});

module.exports = router;