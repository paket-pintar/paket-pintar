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
var packageIdDummy = null
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

// describe('(failed) GET /packages', () => {
//   it('package list is empty (admin)', (done) => {
//       request(app)
//       .get('/packages')
//       .set({ access_token: adminToken })
//       .then(response => {
//           const { status, body } = response
//           expect(status).toBe(200)
//           expect(body).toEqual({ msg: 'there is no package in the list.' })
//           done()
//       })
//       .catch(err => {
//           done(err)
//       })
//   })
  
//   it('package list is empty (customer)', (done) => {
//     request(app)
//     .get('/packages')
//     .set({ access_token: customerToken })
//     .then(response => {
//         const { status, body } = response
//         expect(status).toBe(200)
//         expect(body).toEqual({ msg: 'there is no package in the list.' })
//         done()
//     })
//     .catch(err => {
//         done(err)
//     })
//   })
// })

describe('Create package, POST /packages', () => {
  test('tidak menyertakan access_token', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId,
        receiver: 'Pak Desta'
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
        UserId: UserId,
        receiver: 'Pak Desta'
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        packageId = body.id
        expect(status).toBe(201)
        expect(body).toHaveProperty('description', 'Paket hitam besar')
        expect(body).toHaveProperty('id', packageId)
        expect(body).toHaveProperty('sender', 'JNE')
        expect(body).toHaveProperty('UserId', UserId)
        expect(body).toHaveProperty('claimed', false)
        expect(body).toHaveProperty('receiver', 'Pak Desta')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('success create package(2)', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Paket 15x15cm',
        sender: 'TIKI',
        UserId: dummyId,
        receiver: 'Pak Aldi'
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        packageIdDummy = body.id
        expect(status).toBe(201)
        expect(body).toHaveProperty('description', 'Paket 15x15cm')
        expect(body).toHaveProperty('id', packageIdDummy)
        expect(body).toHaveProperty('sender', 'TIKI')
        expect(body).toHaveProperty('UserId', dummyId)
        expect(body).toHaveProperty('claimed', false)
        expect(body).toHaveProperty('receiver', 'Pak Aldi')
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
        UserId: UserId,
        receiver: 'Pak Bambang'
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
        UserId: UserId,
        receiver: 'Pak Bambang'
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

  test('input receiver string kosong', (done) => {
    request(app)
      .post('/packages')
      .send({
        description: 'Paket pecah belah',
        sender: 'JNE',
        UserId: UserId,
        receiver: ''
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(body).toHaveProperty('msg', 'Receiver cannot be empty!')
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

  test('customer success get packages', (done) => {
    request(app)
      .get('/packages')
      .set({ access_token: customerToken })
      .then(response => {
        let { body, status } = response
        expect(status).toBe(200)
        expect(body[0]).toHaveProperty('id', packageId)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  test('admin success get packages', (done) => {
    request(app)
      .get('/packages')
      .set({ access_token: adminToken })
      .then(response => {
        let { body, status } = response
        expect(status).toBe(200)
        expect(body[0]).toHaveProperty('id', packageIdDummy)
        expect(body[1]).toHaveProperty('id', packageId)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Get package by id, GET /packages:id', () => {
  it('get package with admin token (success)', (done) => {
      request(app)
      .get('/packages/' + packageId)
      .set({ access_token: adminToken })
      .then(response => {
          const { status, body } = response
          expect(status).toBe(200)
          expect(body).toEqual({
            id: packageId,
            description: 'Paket hitam besar',
            sender: 'JNE',
            claimed: false,
            receiver: 'Pak Desta',
            UserId: UserId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            User: {
              id: UserId,
              name: "customer",
              email: "customer@mail.com"
            }
          })
          done()
      })
      .catch(err => {
          done(err)
      })
  })
  it('get package with customer token (success)', (done) => {
    request(app)
    .get('/packages/' + packageId)
    .set({ access_token: customerToken })
    .then(response => {
        const { status, body } = response
        expect(status).toBe(200)
        expect(body).toEqual({
          id: packageId,
          description: 'Paket hitam besar',
          sender: 'JNE',
          claimed: false,
          receiver: 'Pak Desta',
          UserId: UserId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          User: {
            id: UserId,
            name: "customer",
            email: "customer@mail.com"
          }
        })
        done()
    })
    .catch(err => {
        done(err)
    })
  })
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
  it('package not found (failed)', (done) => {
      request(app)
      .get('/packages/' + (packageId + 10))
      .set({ access_token: adminToken })
      .then(response => {
          const { status, body } = response
          expect(status).toBe(404)
          expect(body).toEqual({ msg: 'package not found!' })
          done()
      })
      .catch(err => {
          done(err)
      })
  })
  it('package id is not a number (failed)', (done) => {
      request(app)
      .get(`/packages/${packageId}sss`)
      .set({ access_token: adminToken })
      .then(response => {
          const { status, body } = response
          expect(status).toBe(400)
          expect(body).toEqual({ msg: 'package ID is not valid!' })
          done()
      })
      .catch(err => {
          done(err)
      })
  })
})

describe('Claim package, PATCH /packages', () => {
  test('package ID is not integer', (done) => {
    request(app)
      .patch('/packages/3s')
      .send({
        claimed: true
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
      .patch(`/packages/${packageId + 100}` )
      .send({
        claimed: true
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

  test('success claimed', (done) => {
    request(app)
      .patch(`/packages/${packageId}` )
      .send({
        claimed: 'true'
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(200)
        expect(body).toEqual({
          id: packageId,
          description: 'Paket hitam besar',
          sender: 'JNE',
          claimed: true,
          receiver: 'Pak Desta',
          UserId: UserId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
        done()
      })
      .catch(err => {
        done(err)
      })
  });
})

describe('Update package, PUT /packages', () => {
  test('package ID is not integer', (done) => {
    request(app)
      .put('/packages/3s')
      .send({
        description: 'Paket hitam besar',
        sender: 'JNE',
        UserId: UserId,
        receiver: 'Pak Desta'
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
        UserId: UserId,
        receiver: 'Pak Desta'
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
        claimed: 'false',
        receiver: 'Pak Desta'
      })
      .set({ access_token: adminToken })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(200)
        expect(body).toHaveProperty('description', 'Ukuran 30cm x 30cm, fragile')
        expect(body).toHaveProperty('sender', 'SI LAMBAT')
        expect(body).toHaveProperty('UserId', UserId)
        expect(body).toHaveProperty('claimed', false)
        expect(body).toHaveProperty('id', packageId)
        expect(body).toHaveProperty('receiver', 'Pak Desta')
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
        claimed: 'false',
        receiver: 'Pak Desta'
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

describe('claim all package by user Id, PATCH /packages', () => {
  test('user ID is not valid', (done) => {
    request(app)
      .patch('/packages')
      .set({ access_token: adminToken })
      .send({ UserId: UserId + 's' })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(400)
        expect(body).toHaveProperty('msg', 'UserId is not valid!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('not admin', (done) => {
    request(app)
      .patch('/packages')
      .set({ access_token: customerToken })
      .send({ UserId: UserId })
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

  test('user not found', (done) => {
    request(app)
      .patch('/packages')
      .set({ access_token: adminToken })
      .send({ UserId: UserId + 100 })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(404)
        // kenapa ya?
        expect(body).toHaveProperty('msg', 'user not found!')
        done()
      })
      .catch(err => {
        done(err)
      })
  });

  test('package claimed', (done) => {
    request(app)
      .patch('/packages')
      .set({ access_token: adminToken })
      .send({ UserId: UserId })
      .then(response => {
        let {body, status} = response
        expect(status).toBe(200)
        expect(body[0]).toEqual(1)
        expect(body[1][0]).toHaveProperty('id', packageId)
        expect(body[1][0]).toHaveProperty('claimed', true)
        done()
      })
      .catch(err => {
        done(err)
      })
  });
});

describe('Delete package, DELETE /packages', () => {
  test('package ID is not integer', (done) => {
    request(app)
      .delete('/packages/3s')
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
