let controller = {};
let models = require('../models');
let Color = models.Color;

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Color.findAll({
                attributes: ['id', 'name', 'code', 'imagepath'],
                include: [{ model: models.ProductColor }]
            })
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