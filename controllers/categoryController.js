let controller = {};
let models = require('../models');
let Category = models.Category;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id', 'name', 'imagepath', 'summary'],
            include: [{ model: models.Product, where: {} }]
        };

        if (query && query.search != '') {
            options.include[0].where.name = {
                [Op.iLike]: `%${query.search}%`
            };
        }

        Category.findAll(options)
            .then(data => {
                const categories = data.map((item) => {
                    let values = item.dataValues;
                    let products = item.dataValues.Products;
                    return { id: values.id, name: values.name, imagepath: values.imagepath, summary: values.summary, products: products }
                });
                resolve(categories);
            })
            .catch(error => reject(new Error(error)));
    });
};


module.exports = controller;