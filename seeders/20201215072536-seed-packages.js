'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Packages', [
      {
        description: 'Paket Hitam dari JNE',
        sender: 'Tidak tercantum',
        claimed: false,
        UserId: 2,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Besar coklat dari Gojek',
        sender: 'Toko X',
        claimed: false,
        UserId: 2,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Surat kartu kredit',
        sender: 'Udin',
        claimed: true,
        UserId: 2,
        createdAt : new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Packages', null, {})
  }
};
