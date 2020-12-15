'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'John Doe',
        password: hashPassword('customer'),
        email: 'johndoe@mail.com',
        role: 'customer',
        unit: '9A / 2C',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bintang Wibawa Mukti',
        password: hashPassword('customer'),
        email: 'bintang@mail.com',
        role: 'customer',
        unit: '2 / 1B',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Deo Mareza',
        password: hashPassword('customer'),
        email: 'bintang@mail.com',
        role: 'customer',
        unit: '1E / 1B',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Agung Prasetio',
        password: hashPassword('customer'),
        email: 'agung@mail.com',
        role: 'customer',
        unit: '5 / 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Atian Junanda',
        password: hashPassword('customer'),
        email: 'atian@mail.com',
        role: 'customer',
        unit: '3 / 5A',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Arnold',
        password: hashPassword('customer'),
        email: 'arnold@mail.com',
        role: 'customer',
        unit: '3 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },

  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
