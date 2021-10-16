let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');
let commentController = require('../controllers/commentController');

router.post('/', userController.isLoggedIn, async(req, res, next) => {
    try {
        let comment = {
            userId: req.session.user.id,
            productId: req.body.productId,
            message: req.body.message
        };

        if (!isNaN(req.body.parentCommentId) && (req.body.parentCommentId !== '')) {
            comment.parentCommentId = req.body.parentCommentId;
        }

        const addComment = await commentController.add(comment);

        res.redirect(`/products/${addComment.productId}`);

    } catch (error) {
        next(error);
    }
});

module.exports = router;