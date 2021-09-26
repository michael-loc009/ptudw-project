let controller = {};
let models = require('../models');
let Color = models.Color;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id', 'name', 'code', 'imagepath'],
            include: [{
                model: models.ProductColor,
                include: [{
                    model: models.Product,
                    attributes: [],
                    where: {
                        price: {
                            [Op.gte]: query.min,
                            [Op.lte]: query.max
                        }
                    }
                }]
            }]
        };

        if (query.category > 0) {
            options.include[0].include[0].where.categoryId = query.category;
        }

        if (query.search != '') {
            options.include[0].include[0].where.name = {
                [Op.iLike]: `%${query.search}%`
            };
        }

        if (query.brand > 0) {
            options.include[0].include[0].where.brandId = query.brand;
        }

        Color.findAll(options)
            .then(data => {
                const colors = data.map((item) => {
                    let values = item.dataValues;
                    let productColors = item.dataValues.ProductColors;
                    return { id: values.id, name: values.name, imagepath: values.imagepath, summary: values.summary, productColors: productColors }
                });
                resolve(colors);
            })
            .catch(error => reject(new Error(error)));
    });
};


module.exports = controller;