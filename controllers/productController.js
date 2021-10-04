let controller = {};
let models = require('../models');
const { options } = require('../routes/productRouter');
let Product = models.Product;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getTrendingProducts = (limit) => {
    return new Promise((resolve, reject) => {
        Product.findAll({
                order: [
                    ['overallReview', 'DESC']
                ],
                limit: limit,
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


controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            include: [{ model: models.Category }],
            attributes: ['id', 'name', 'imagepath', 'price', 'categoryId'],
            where: {
                price: {
                    [Op.gte]: query.min,
                    [Op.lte]: query.max
                }
            }
        };

        if (query.category > 0) {
            options.where.categoryId = query.category;
        }

        if (query.search != '') {
            options.where.name = {
                [Op.iLike]: `%${query.search}%`
            };
        }

        if (query.brand > 0) {
            options.where.brandId = query.brand;
        }

        if (query.color > 0) {
            options.include.push({
                model: models.ProductColor,
                attributes: [],
                where: { colorId: query.color }
            });
        }

        if (query.limit > 0) {
            options.limit = query.limit;
            options.offset = query.limit * (query.page - 1);
        }

        if (query.sort) {
            switch (query.sort) {
                case 'price':
                    options.order = [
                        ['price', 'ASC']
                    ];
                    break;
                case 'overallReview':
                    options.order = [
                        ['overallReview', 'DESC']
                    ];
                    break;
                default:
                    options.order = [
                        ['name', 'ASC']
                    ];
                    break;
            }
        }

        Product.findAndCountAll(options)
            .then(data => {
                console.log(data)
                let products = data.rows.map((item) => {
                    let values = item.dataValues;
                    let category = item.Category.dataValues;
                    return { id: values.id, name: values.name, imagepath: values.imagepath, price: values.price, category: category }
                });

                products.count = data.count;
                resolve(products);
            })
            .catch(error => reject(new Error(error)));
    });
};

controller.getById = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let product;
            let productData = await Product.findOne({
                where: { id: id },
                include: [{ model: models.Category }]
            });
            product = productData.dataValues;
            product.overallReview = product.overallReview.toLocaleString();
            product.category = productData.Category.dataValues;

            let productSpecifications = await models.ProductSpecification.findAll({ where: { productId: id }, include: [{ model: models.Specification }] });

            product.productSpecifications = productSpecifications.map((item) => {
                let productSpec = item.dataValues;
                let spec = item.Specification.dataValues;
                return {...productSpec, specification: spec }
            });

            let comments = await models.Comment.findAll({
                where: { productId: id, parentCommentId: null },
                include: [{ model: models.User }, { model: models.Comment, as: 'SubComments', include: [{ model: models.User }] }]
            });

            product.comments = comments.map((item) => {

                let subComments = item.SubComments.map((item1) => {
                    return {...item1.dataValues, user: item1.User.dataValues };
                })

                return {...item.dataValues, user: item.User.dataValues, subComments: subComments };
            });

            let reviews = await models.Review.findAll({
                where: { productId: id },
                include: [{ model: models.User }]
            });

            product.reviews = reviews.map(item => {
                return {...item.dataValues, user: item.User.dataValues }
            });
            let stars = [];
            for (let i = 1; i <= 5; i++) {
                stars.push(product.reviews.filter(item => (item.rating == i)).length);
            }
            product.stars = stars;

            resolve(product);

        } catch (error) {
            reject(new Error(error));
        }
    });
};

module.exports = controller;