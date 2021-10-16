let controller = {};
let models = require('../models');
let User = models.User;
let bcrypt = require('bcryptjs');

controller.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({
                where: { username: email }
            }).then(data => {
                if (data) {
                    resolve(data.dataValues);
                } else {
                    resolve(null);
                }
            })
            .catch(error => reject(new Error(error)));
    });
};

controller.createUser = (user) => {
    let salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    user.avatarPath = '/img/product/review-1.png';

    return new Promise((resolve, reject) => {
        User.create(user).then(data => {
            resolve(data.dataValues);
        }).catch(error => reject(new Error(error)));
    });
};

controller.comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
};

controller.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect(`/users/login?returnURL=${req.originalUrl}`);
    }
};

module.exports = controller;