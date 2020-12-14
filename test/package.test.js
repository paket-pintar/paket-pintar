const request = require('supertest')
const app = require('../app')
const { sequelize, User, Package } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
// const { response } = require('../app')
var adminToken = null
var customerToken = null
var customerImpostorToken = signToken({ email: 'impostor@mail.com', role: 'customer'  })
var UserId = null
var packageId = null
var dummyId = null
var dummyToken = null

beforeAll(done => {
  console.log('===========test package begun=========');
  
  queryInterface.bulkInsert(
    'Users',
    [
      {
        name: 'admin',
        email: 'admin@mail.com',
        password: hashPassword('admin'),
        role: 'admin',
        unit: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'customer',
        email: 'customer@mail.com',
        password: hashPassword('customer'),
        unit: '9A / 2C',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
          name: 'dummy',
          email: 'dummy@mail.com',
          password: hashPassword('qweqwe'),
          role: 'customer',
          unit: '-',
          createdAt: new Date(),
          updatedAt: new Date()
      }
    ]
  )
    .then(() => {
      return (User.findOne({ where: { email: 'admin@mail.com' } }))
    })
    .then(admin => {
      const tokenPayload = { email: admin.email, role: admin.role }
      adminToken = signToken(tokenPayload)
      return (User.findOne({ where: { email: 'customer@mail.com' } }))
    })
    .then(customer => {
      const tokenPayload = { email: customer.email, role: customer.role }
      UserId = customer.id
      customerToken = signToken(tokenPayload)
      return (User.findOne({ where: { email: 'dummy@mail.com' } }))
    })
    .then(dummy => {
      const tokenPayload = { email: dummy.email, role: dummy.role }
      dummyId = dummy.id
      dummyToken = signToken(tokenPayload)
      done()
    })
    .catch(err => {
      done(err)
    })
})

afterAll ((done) => {
  queryInterface.bulkDelete('Packages')
    .then(() => {
      return (queryInterface.bulkDelete('Users'))
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
})

describe('Create package, POST /packages', () => {
  test('tidak menyertakan access_token', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId
      })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(401)
        expect(body).toHaveProperty('msg', 'not authenticated!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('success create package', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        packageId = body.id
        expect(body).toHaveProperty('description', 'Paket hitam besar')
        expect(status).toBe(201)
        expect(body).toHaveProperty('sender', 'JNE')
        expect(body).toHaveProperty('UserId', UserId)
        expect(body).toHaveProperty('claimed', false)
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('menyertakan access_token tapi bukan admin', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId
      })
      .set({ access_token: customerToken })
      .then(response => {
        let {body, status} = response
        expect(body).toHaveProperty('msg', 'not authorized!')
        expect(status).toBe(401)
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('user tidak ditemukan', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId + 10
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(body).toHaveProperty('msg', 'customer not found!')
        expect(status).toBe(404)
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('input sender string kosong', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Paket hitam besar',
        sender: '',
        UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(body).toHaveProperty('msg', 'Sender cannot be empty!')
        expect(status).toBe(400)
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('input description string kosong', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: '',
        sender: 'JNE',
        UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(body).toHaveProperty('msg', 'Description cannot be empty!')
        expect(status).toBe(400)
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('input description null', (done) => {
    request(app)
      .post('/packages')
      .send({
        // description: 'Barang pecah belah',
        sender: 'JNE',
        UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(body).toHaveProperty('msg', 'Description cannot be null!')
        expect(status).toBe(400)
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('input sender null', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Barang pecah belah',
        // sender: 'JNE',
        UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(body).toHaveProperty('msg', 'Sender cannot be null!')
        expect(status).toBe(400)
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('input UserId null', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Barang pecah belah',
        sender: 'JNE',
        // UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(body).toHaveProperty('msg', 'customer not found!')
        expect(status).toBe(404)
        done()
      })
      .catch(err => {
        done(err)
      })
  });
})

describe('Get all Package, GET /packages', () => {
  test('unidentified user', (done) => {
    request(app)
      .get('/packages')
      .set({ access_token: customerImpostorToken })
      .then(response => {
        let { body, status } = response
        expect(status).toBe(401)
        expect(body).toHaveProperty('msg', 'not authenticated!')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})


describe('Get package by id, GET /packages:id', () => {
  // it('get package with admin token (success)', (done) => {
  //     request(app)
  //     .get('/packages/' + packageId)
  //     .set({ access_token: adminToken })
  //     .then(response => {
  //         const { status, body } = response
  //         expect(status).toBe(200)
  //         expect(body).toEqual({
  //           id: packageId,
  //           description: expect.any(String),
  //           sender: expect.any(String),
  //           claimed: expect.any(Boolean),
  //           UserId: UserId,
  //           createdAt: expect.any(String),
  //           updatedAt: expect.any(String),
  //           User: {
  //             id: 4,
  //             name: "customer",
  //             email: "customer@mail.com"
  //           }
  //         })
  //         done()
  //     })
  //     .catch(err => {
  //         done(err)
  //     })
  // })
  it('get package with not authorized user (failed)', (done) => {
      request(app)
      .get('/packages/' + packageId)
      .set({ access_token: dummyToken })
      .then(response => {
          const { status, body } = response
          expect(status).toBe(401)
          expect(body).toEqual({ msg: 'not authorized!' })
          done()
      })
      .catch(err => {
          done(err)
      })
  })
  // it('package not found (failed)', (done) => {
  //     request(app)
  //     .get('/packages/' + (packageId + 10))
  //     .set({ access_token: adminToken })
  //     .then(response => {
  //         const { status, body } = response
  //         expect(status).toBe(404)
  //         expect(body).toEqual({ msg: 'package not found!' })
  //         done()
  //     })
  //     .catch(err => {
  //         done(err)
  //     })
  // })
  // it('package id not valid (failed)', (done) => {
  //     request(app)
  //     .get('/packages/' + packageId + 's')
  //     .set({ access_token: adminToken })
  //     .then(response => {
  //         const { status, body } = response
  //         expect(status).toBe(400)
  //         expect(body).toEqual({ msg: 'package ID is not valid!' })
  //         done()
  //     })
  //     .catch(err => {
  //         done(err)
  //     })
  // })
})

describe('Update package, PUT /packages', () => {
  test('package ID is not integer', (done) => {
    request(app)
      .put('/packages/3s')
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(400)
        expect(body).toHaveProperty('msg', 'package ID is not valid!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('package not found', (done) => {
    request(app)
      .put('/packages/' + (packageId + 10))
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(404)
        expect(body).toHaveProperty('msg', 'package not found!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('package updated succesfully', (done) => {
    request(app)
      .put('/packages/' + packageId)
      .send({
        description: 'Ukuran 30cm x 30cm, fragile',
        sender: 'SI LAMBAT',
        UserId: UserId,
        claimed: 'true'
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(200)
        expect(body).toHaveProperty('description', 'Ukuran 30cm x 30cm, fragile')
        expect(body).toHaveProperty('sender', 'SI LAMBAT')
        expect(body).toHaveProperty('UserId', UserId)
        expect(body).toHaveProperty('claimed', true)
        expect(body).toHaveProperty('id', packageId)
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('not admin', (done) => {
    request(app)
      .put('/packages/' + packageId)
      .send({
        description: 'Ukuran 30cm x 30cm, fragile',
        sender: 'SI LAMBAT',
        UserId: UserId,
        claimed: 'true'
      })
      .set({ access_token: customerToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(401)
        expect(body).toHaveProperty('msg', 'not authorized!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });
});

// describe('arrayContaining', () => {
//   const expected = ['Alice', 'Bob'];
//   it('matches even if received contains additional elements', () => {
//     expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
//   });
//   it('does not match if received does not contain expected elements', () => {
//     expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(expected));
//   });
// });


describe('Delete package, Delete /packages', () => {
  test('package ID is not integer', (done) => {
    request(app)
      .delete('/packages/3s')
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(400)
        expect(body).toHaveProperty('msg', 'package ID is not valid!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('not admin', (done) => {
    request(app)
      .delete('/packages/' + packageId)
      .set({ access_token: customerToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(401)
        expect(body).toHaveProperty('msg', 'not authorized!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('package not found', (done) => {
    request(app)
      .delete('/packages/' + (packageId + 10))
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(404)
        expect(body).toHaveProperty('msg', 'package not found!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('package deleted', (done) => {
    request(app)
      .delete('/packages/' + packageId)
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(200)
        expect(body).toHaveProperty('msg', 'package deleted succesfully!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });
});