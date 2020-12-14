'use strict';
const { hashPassword } = require('../helpers/bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'admin',
        password: hashPassword('admin'),
        email: 'admin@mail.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'customer',
        password: hashPassword('customer'),
        email: 'customer@mail.com',
        role: 'customer',
        unit: '9A / C2',
        createdAt: new Date(),
        updatedAt: new Date()
      },

  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
