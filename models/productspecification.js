'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSpecification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductSpecification.belongsTo(models.Product, {foreignKey: 'productId'});
      ProductSpecification.belongsTo(models.Specification, {foreignKey: 'specificationId'});
    }
  };
  ProductSpecification.init({
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ProductSpecification',
  });
  return ProductSpecification;
};