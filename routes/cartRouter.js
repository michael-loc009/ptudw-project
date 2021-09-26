let express = require('express');
let router = express.Router();

router.get('/', async(req, res) => {
    let cart = req.session.cart;
    res.locals.cart = cart.getCart();
    res.render('cart');
});

router.post('/', async(req, res, next) => {
    let productId = req.body.id;
    let quantity = isNaN(req.body.quantity) ? 1 : req.body.quantity;
    let productController = require('../controllers/productController');

    try {
        const product = await productController.getById(productId);
        const cartItem = req.session.cart.add(product, productId, quantity);
        res.json(cartItem);
    } catch (error) {
        next(error);
    }
});

router.put('/', (req,res)=>{
    var productId = req.body.id;
    var quantity = parseInt(req.body.quantity);
    var cartItem = req.session.cart.update(productId,quantity);
    res.json(cartItem);
});


router.delete('/', (req,res)=>{
    var productId = req.body.id;
    req.session.cart.remove(productId);
    res.json({
        totalQuantity: req.session.cart.totalQuantity,
        totalPrice: req.session.cart.totalPrice
    });
});

router.delete('/all', (req,res)=>{
    req.session.cart.empty();
    res.sendStatus(204);
    res.end();
});

module.exports = router;