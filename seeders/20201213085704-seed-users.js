'use strict';
const { hashPassword } = require('../helpers/bcrypt')

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
        email: 'deo@mail.com',
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
      {
        name: 'Heru',
        password: hashPassword('customer'),
        email: 'heru@mail.com',
        role: 'customer',
        unit: '4 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ika',
        password: hashPassword('customer'),
        email: 'ika@mail.com',
        role: 'customer',
        unit: '11 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rendi',
        password: hashPassword('customer'),
        email: 'rendi@mail.com',
        role: 'customer',
        unit: '12 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Roy',
        password: hashPassword('customer'),
        email: 'roy@mail.com',
        role: 'customer',
        unit: '11 / 12',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Denny',
        password: hashPassword('customer'),
        email: 'denny@mail.com',
        role: 'customer',
        unit: '11 / 9',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sugeng',
        password: hashPassword('customer'),
        email: 'sugeng@mail.com',
        role: 'customer',
        unit: '7 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Slamet',
        password: hashPassword('customer'),
        email: 'slamet@mail.com',
        role: 'customer',
        unit: '77 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Riyadi',
        password: hashPassword('customer'),
        email: 'riyadi@mail.com',
        role: 'customer',
        unit: '15 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rosa',
        password: hashPassword('customer'),
        email: 'rosa@mail.com',
        role: 'customer',
        unit: '1 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Via Vallen',
        password: hashPassword('customer'),
        email: 'valen@mail.com',
        role: 'customer',
        unit: '20 / 14',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Luna',
        password: hashPassword('customer'),
        email: 'luna@mail.com',
        role: 'customer',
        unit: '99 / 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
