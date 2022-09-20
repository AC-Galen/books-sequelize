'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Books', 'category_id', {
      type: Sequelize.INTEGER, // 對應id 是整數
      allowNull: false, // 不允許空值
      references: { // 寫references決定資料庫變動後,關聯是否存在
        model: 'Categories',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Books', 'category_id')
  }
}
