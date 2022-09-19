'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      ['文學小說', '商業理財', '藝術設計', '人文社科', '心理勵志', '宗教命理', '自然科普', '語言學習']
        .map(item => {
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
