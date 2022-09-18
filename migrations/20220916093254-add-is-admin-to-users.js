'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'is_admin', { // 在Users 資料庫中加入is_admin欄位(資料表, 欄位名稱, 欄位屬性)
      type: Sequelize.BOOLEAN, // 型態是布林值, 預設是false
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin') // 把User 資料庫中is_admin的欄位刪除
  }
}
