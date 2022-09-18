'use strict'
const { faker } = require('@faker-js/faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Books',
      Array.from({ length: 50 }, () => ({
        name: faker.name.fullName(),
        isbn: faker.datatype.number({ min: 9780000000000 }),
        author: faker.name.fullName(),
        publisher: faker.company.name(),
        image: `https://loremflickr.com/320/240/library,book/?random=${Math.random() * 100}`,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Books', {})
  }
}
