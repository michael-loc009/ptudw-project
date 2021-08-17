let controller = {};
let models = require('../models');
let Brand = models.Brand;

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Brand.findAll({
                attributes: ['id', 'name', 'imagepath'],
                include: [{model: models.Product}]
            })
            .then(data => {
                const brands = data.map((item) => { 
                    let values = item.dataValues;
                    let products = item.dataValues.Products;
                    return { id: values.id, name: values.name, imagepath: values.imagepath, summary: values.summary, products: products} });
                resolve(brands);
            })
            .catch(error => reject(new Error(error)));
    });
};


module.exports = controller;