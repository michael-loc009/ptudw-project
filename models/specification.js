'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specification.hasMany(models.ProductSpecification, {foreignKey: 'specificationId'});
    }
  };
  Specification.init({
    name: DataTypes.STRING,
    imagepath: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Specification',
  });
  return Specification;
};