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
        description: 'Kecil merah dari JNE',
        sender: 'Pak Jambul',
        claimed: false,
        UserId: 3,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Hitam sedang dari JNE',
        sender: 'Tokopedia',
        claimed: true,
        UserId: 3,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Kulkas Silver',
        sender: 'Shoppee',
        claimed: false,
        UserId: 10,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Amplop coklat',
        sender: 'Ibu RT',
        claimed: true,
        UserId: 3,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Hitam sedang dari JNE',
        sender: 'Tokopedia',
        claimed: false,
        UserId: 4,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Matras Kuning',
        sender: 'BliBli',
        claimed: false,
        UserId: 4,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Amplop coklat',
        sender: 'Ibu RT',
        claimed: true,
        UserId: 4,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Tas Gucci',
        sender: 'Andrea',
        claimed: false,
        UserId: 5,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Karung Beras',
        sender: 'BliBli',
        claimed: false,
        UserId: 16,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Amplop coklat',
        sender: 'Ibu RT',
        claimed: false,
        UserId: 5,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Paket Kotak Kayu',
        sender: 'Tokopedia',
        claimed: false,
        UserId: 6,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Kotak Merah Kecil',
        sender: 'BliBli',
        claimed: false,
        UserId: 6,
        createdAt : new Date(),
        updatedAt: new Date()
      },
      {
        description: 'Amplop coklat',
        sender: 'Ibu RT',
        claimed: false,
        UserId: 6,
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
