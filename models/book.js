'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Book.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Book.hasMany(models.Comment, { foreignKey: 'bookId' })
      Book.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'bookId',
        as: 'FavoritedUsers'
      })
      Book.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'bookId',
        as: 'LikedUsers'
      })
    }
  };
  Book.init({
    name: DataTypes.STRING,
    isbn: DataTypes.STRING,
    author: DataTypes.STRING,
    publisher: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'Books',
    underscored: true
  })
  return Book
}
