let controller = {};
let models = require('../models');
let Category = models.Category;

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Category.findAll({
                attributes: ['id', 'name', 'imagepath', 'summary']
            })
            .then(data => {
                const categories = data.map((item) => { 
                    let values = item.dataValues;
                    return { id: values.id, name: values.name, imagepath: values.imagepath, summary: values.summary } });
                resolve(categories);
            })
            .catch(error => reject(new Error(error)));
    });
};


module.exports = controller;