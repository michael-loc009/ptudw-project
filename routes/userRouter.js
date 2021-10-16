let express = require('express');
const controller = require('../controllers/categoryController');
let router = express.Router();
let userController = require('../controllers/userController');

router.get('/login', async(req, res, next) => {
    req.session.returnURL = req.query.returnURL;
    res.render('login');
});

router.post('/login', async(req, res, next) => {
    let email = req.body.username;
    let password = req.body.password;
    let keepLoggedIn = req.body.keepLoggedIn != undefined;
    try {
        let existingUser = await userController.getUserByEmail(email);
        if (existingUser == null) {
            res.render('login', {
                message: `Email does not exist!`,
                type: 'alert-danger'
            });
        } else {
            let isMatch = userController.comparePassword(password, existingUser.password);

            if (isMatch) {
                req.session.cookie.maxAge = keepLoggedIn ? 30 * 24 * 60 * 60 * 100 : null;
                req.session.user = existingUser;
                if (req.session.returnURL){
                    res.redirect(req.session.returnURL);
                }else{
                    res.redirect('/');
                }
            } else {
                res.render('login', {
                    message: `Password is incorrect!`,
                    type: 'alert-danger'
                });
            }
        }
    } catch (error) {
        next(error);
    }
});

router.get('/logout', async(req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/users/login');
        }
    })
});

router.get('/register', async(req, res, next) => {
    res.render('register');
});

router.post('/register', async(req, res, next) => {
    let user = {
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password
    };
    let confirmPassword = req.body.confirmPassword;
    let keepLoggedIn = req.body.keepLoggedIn != undefined;

    try {
        // Kiem tra input
        if (!user.fullname || user.fullname.trim().length == 0) {
            res.render('register', {
                message: 'Full name is required',
                type: 'alert-danger'
            });
        }
        if (!user.username || user.username.trim().length == 0) {
            res.render('register', {
                message: 'Username is required',
                type: 'alert-danger'
            });
        }
        if (!user.password || user.password.length == 0) {
            res.render('register', {
                message: 'Password is required',
                type: 'alert-danger'
            });
        }
        // Kiem tra confirm password va password giong nhau
        if (confirmPassword != user.password) {
            res.render('register', {
                message: 'Confirm password does not match!',
                type: 'alert-danger'
            });
        }
        // Kiem tra username chua ton tai
        let existingUser = await userController.getUserByEmail(user.username);
        if (existingUser != null) {
            res.render('register', {
                message: `Email ${user.username} exists! Please choose another email.`,
                type: 'alert-danger'
            });
        }
        // Tao tai khoan
        let createdUser = await userController.createUser(user);
        if (keepLoggedIn) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 100;
            req.session.user = createdUser;
            res.redirect('/');
        } else {
            res.render('login', {
                message: 'You have registered, now please login!',
                type: 'alert-primary'
            });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;