'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Favorite.init({
    userId: DataTypes.INTEGER, // 改小駝峰式命名
    bookId: DataTypes.INTEGER // 改小駝峰式命名
  }, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'Favorties',
    underscored: true
  })
  return Favorite
}
