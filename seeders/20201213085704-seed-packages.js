'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Packages', [
      {
        description: 'Paket Hitam dari JNE',
        sender: 'Tidak tercantum',
        claimed: false,
        UserId: 3,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Besar coklat dari Gojek',
        sender: 'Toko X',
        claimed: false,
        UserId: 3,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Surat kartu kredit',
        sender: 'Udin',
        claimed: true,
        UserId: 3,
        createdAt : new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Packages', null, {})
  }
};
