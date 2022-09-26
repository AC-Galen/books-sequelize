'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.belongsToMany(models.Book, {
        through: models.Favorite,
        foreignKey: 'userId',
        as: 'FavoritedBooks'
      })
      User.belongsToMany(models.Book, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedBooks'
      })
      User.belongsToMany(User, { // sequelize了解這是個一對多關聯(一個使用者可以被很多使用者追蹤)
        through: models.Followship, // 透過Followship model查資料
        foreignKey: 'followingId', // 到了 Followship model 以後，要把現在的 user.id 對應到 Followship 裡的 followingId，假設 user.id 是 5，就去搜尋所有 followingId 是 5 的資料
        as: 'Followers' // 給這些使用者一個別名叫做 Followers，讓我們在 controller 以及 view 裡面可以用這個別名存取到(被追蹤)
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings' // (追蹤)
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
