'use strict'
const { faker } = require('@faker-js/faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 查詢Categories 的 id有哪些
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Books',
      Array.from({ length: 50 }, () => ({
        name: faker.name.fullName(),
        isbn: faker.datatype.number({ min: 9780000000000 }),
        author: faker.name.fullName(),
        publisher: faker.company.name(),
        image: `https://loremflickr.com/320/240/library,book/?random=${Math.random() * 100}`,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Books', {})
  }
}
