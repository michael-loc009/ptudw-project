let express = require('express');
let router = express.Router();

router.post('/', async(req, res, next) => {
    let controller = require('../controllers/commentController');

    try {
        let comment = {
            userId: 1,
            productId: req.body.productId,
            message: req.body.message
        };

        if (!isNaN(req.body.parentCommentId) && (req.body.parentCommentId !== '')) {
            comment.parentCommentId = req.body.parentCommentId;
        }

        const addComment = await controller.add(comment);

        res.redirect(`/products/${addComment.productId}`);

    } catch (error) {
        next(error);
    }
});

module.exports = router;