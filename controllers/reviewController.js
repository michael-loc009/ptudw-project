let controller = {};
let models = require('../models');
let Review = models.Review;
let Sequelize = require('sequelize');
let Product = models.Product;
let Op = Sequelize.Op;

controller.add = (review) => {
    return new Promise((resolve, reject) => {
        Review.findOne({
            where:{
                userId: review.userId,
                productId: review.productId
            }
        }).then(data=>{
            if (data){
                return Review.update(review,{
                    where:{
                        userId: review.userId,
                        productId: review.productId
                    }
                })
            }else{
                return Review.create(review);
            }
        }).then(()=> {
            Product.findOne({
                where: {id: review.productId},
                include: [{model: Review}]
            }).then(data =>{
                let product = data.dataValues;
                product.reviewCount = product.Reviews.length;
                let overallReview = 0;
                for (let i = 0; i < product.reviewCount; i++){
                    overallReview += product.Reviews[i].dataValues.rating;
                }
                overallReview = overallReview/ product.reviewCount;
                Product.update({
                    overallReview: overallReview,
                    reviewCount: product.reviewCount
                },{where: {id: product.id }})
            });
        }).then(data=>resolve(data))
        .catch(error => reject(new Error(error)));
    });
};


controller.getUserReviewProduct = (userId, productId)=>{
    return new Promise((resolve, reject) => {
        Review.findOne({
            where:{
                userId,
                productId
            }
        }).then(data=> {
            if (data){
                resolve(data.dataValues);
            }else{
                resolve({rating:0, message: ''});
            }
        })
        .catch(error =>reject(new Error(error)));
    });
}

module.exports = controller;