const request = require('supertest')
const app = require('../app')
const { sequelize, User, Package } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const { response } = require('../app')
var adminToken = null
var customerToken = null
var UserId = null
var productId = null

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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'customer',
        email: 'customer@mail.com',
        password: hashPassword('customer'),
        role: 'customer',
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
      console.log(adminToken);
      return (User.findOne({ where: { email: 'customer@mail.com' } }))
    })
    .then(customer => {
      const tokenPayload = { email: customer.email, role: customer.role }
      UserId = customer.id
      customerToken = signToken(tokenPayload)
      // return (User.findOne({ where: { email: 'customer@mail.com' } }))
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
        productId = body.id
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
  test('tidak menyertakan access_token', (done) => {
    request(app)
      .post('/packages')
      .send({})
      .set({})
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

  // test.only('admin success mengambil semua data packages', (done) => {
  //   request(app)
  //     .get('/packages')
  //     .send({})
  //     .set({ access_token: adminToken})
  //     .then(response => {
  //       let { body, status } = response
  //       const expected = [
  //         {
  //           "id": productId,
  //           "UserId": UserId,
  //           "description": "Paket hitam besar",
  //           "sender": "JNE",
  //           "claimed": false
  //         }
  //       ] 
  //       // expect(body).toHaveProperty('msg', 'not authenticated!') 
  //       expect(body).toEqual(expect.arrayContaining(expected));
  //       expect(status).toBe(401)
  //       done()
  //     })
  //     .catch(err => {
  //       done(err)
  //     })
  // })
})

// describe('arrayContaining', () => {
//   const expected = ['Alice', 'Bob'];
//   it('matches even if received contains additional elements', () => {
//     expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
//   });
//   it('does not match if received does not contain expected elements', () => {
//     expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(expected));
//   });
// });