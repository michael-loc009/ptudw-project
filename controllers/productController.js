let controller = {};
let models = require('../models');
let Product = models.Product;

controller.getTrendingProducts = () => {
    return new Promise((resolve, reject) => {
        Product.findAll({
                order: [
                    ['overallReview', 'DESC']
                ],
                limit: 8,
                include: [{ model: models.Category }],
                attributes: ['id', 'name', 'imagepath', 'price']
            })
            .then(data => {
                const trendingProducts = data.map((item) => {
                    let values = item.dataValues;
                    let category = item.Category.dataValues;
                    return { id: values.id, name: values.name, imagepath: values.imagepath, price: values.price, category: category }
                });
                resolve(trendingProducts);
            })
            .catch(error => reject(new Error(error)));
    });
};


controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Product.findAll({
                include: [{ model: models.Category }],
                attributes: ['id', 'name', 'imagepath', 'price']
            })
            .then(data => {
                const trendingProducts = data.map((item) => {
                    let values = item.dataValues;
                    let category = item.Category.dataValues;
                    return { id: values.id, name: values.name, imagepath: values.imagepath, price: values.price, category: category }
                });
                resolve(trendingProducts);
            })
            .catch(error => reject(new Error(error)));
    });
};

module.exports = controller;