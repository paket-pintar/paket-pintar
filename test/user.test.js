const request = require('supertest')
const app = require('../app')
const { sequelize, User } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
// const { response } = require('express')
var adminToken = null
var customerToken = null
var customerId = null
var dummyId = null

const user = [
    {
        name: 'admin',
        email: 'admin@mail.com',
        password: hashPassword('123456'),
        role: 'admin',
        unit: null,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]

beforeAll((done) => {
    queryInterface.bulkInsert('Users', user, {})
        .then(() => {
            done()
        })
        .catch(err => {
            done(err)
        })
})

afterAll((done) => {
    queryInterface.bulkDelete('Users')
        .then(() => {
            done()
        })
        .catch(err => {
            done(err)
        })
})

describe('POST /login-admin', () => {
    it('test admin login success', (done) => {
        request(app)
        .post('/login-admin')
        .send({email: 'admin@mail.com', password: '123456'})
        .then(response => {
            const { status, body } = response
            adminToken = body.access_token
            expect(status).toBe(200)
            expect(body).toHaveProperty('access_token', expect.any(String))
            expect(body).toHaveProperty('email', 'admin@mail.com')
            expect(body).toHaveProperty('role', 'admin')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('test login failed (wrong email)', (done) => {
        request(app)
        .post('/login-admin')
        .send({email: 'tidakada@mail.com', password: '123456'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(401)
            expect(body).toHaveProperty('msg', 'Email/password is wrong!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('test login failed (wrong password)', (done) => {
        request(app)
        .post('/login-admin')
        .send({email: 'admin@mail.com', password: '123457'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(401)
            expect(body).toHaveProperty('msg', 'Email/password is wrong!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    
    it('test login failed (null input email and password)', (done) => {
        request(app)
        .post('/login-admin')
        .send({email: '', password: ''})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Password and email cannot be empty!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
})

describe('(failed) GET /users', () => {
    it('user list is empty (failed)', (done) => {
        request(app)
        .get('/users')
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(200)
            expect(body).toEqual({ msg: 'there is no user in the list.' })
            done()
        })
        .catch(err => {
            done(err)
        })
    })
})

describe('POST /register', () => {
    it('test register success', (done) => {
        request(app)
        .post('/register')
        .send({name: 'customer', email: 'customer@mail.com', password: '123456', unit: '9A / C2'})
        .then(response => {
            const { status, body } = response
            customerId = body.id
            expect(status).toBe(201)
            expect(body).toHaveProperty("id", expect.any(Number))
            expect(body).toHaveProperty("name", 'customer')
            expect(body).toHaveProperty("email", 'customer@mail.com')
            expect(body).toHaveProperty("unit", '9A / C2')   
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('test register success (second)', (done) => {
        request(app)
        .post('/register')
        .send({
            name: 'dummy',
            email: 'dummy@mail.com',
            password: 'qweqwe',
            unit: '-'
        })
        .then(response => {
            const { status, body } = response
            dummyId = body.id
            expect(status).toBe(201)
            expect(body).toHaveProperty("id", expect.any(Number))
            expect(body).toHaveProperty("name", 'dummy')
            expect(body).toHaveProperty("email", 'dummy@mail.com')
            expect(body).toHaveProperty("unit", '-')   
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('test register failed (username empty)', (done) => {
        request(app)
        .post('/register')
        .send({name: '', email: 'admin2@mail.com', password: '123456', unit: '9A / C2'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Name cannot be empty!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('tes register failed (email empty)', (done) => {
        request(app)
        .post('/register')
        .send({name: 'user', email: '', password: '123456', unit: '9A / C2'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Email cannot be empty!')
            done()
        })
        .catch(err => {
            done(err)
        })     
    })
    it('tes register failed (not use email format)', (done) => {
        request(app)
        .post('/register')
        .send({name: 'user', email: 'usercom', password: '123456', unit: '9A / C2'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Please use email format!')
            done()
        })
        .catch(err => {
            done(err)
        })     
    })
    it('tes register failed (password empty)', (done) => {
        request(app)
        .post('/register')
        .send({name: 'user', email: 'user@mail.com', password: '', unit: '9A / C2'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Password cannot be empty!')
            done()
        })
        .catch(err => {
            done(err)
        })     
    })
    it('tes register failed (password below 6 characters)', (done) => {
        request(app)
        .post('/register')
        .send({name: 'user', email: 'user@mail.com', password: '123', unit: '9A / C2'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Password length minimum 6 characters!')
            done()
        })
        .catch(err => {
            done(err)
        })     
    })
    it('test register failed (email already taken)', (done) => {
        request(app)
        .post('/register')
        .send({name: 'admin', email: 'admin@mail.com', password: '123456', unit: '9A / C2'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Email already taken!')
            done()
        })
        .catch(err => {
            done(err)
        })     
    })
})

describe('POST /login-user', () => {
    it('test user login success', (done) => {
        request(app)
        .post('/login-user')
        .send({email: 'customer@mail.com', password: '123456'})
        .then(response => {
            const { status, body } = response
            customerToken = body.access_token
            expect(status).toBe(200)
            expect(body).toHaveProperty('access_token', expect.any(String))
            expect(body).toHaveProperty('email', 'customer@mail.com')
            expect(body).toHaveProperty('name', 'customer')
            expect(body).toHaveProperty('unit', '9A / C2')
            expect(body).toHaveProperty('id', customerId)
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('test login failed (wrong email)', (done) => {
        request(app)
        .post('/login-user')
        .send({email: 'tidakada@mail.com', password: '123456'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(401)
            expect(body).toHaveProperty('msg', 'Email/password is wrong!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('test login failed (wrong password)', (done) => {
        request(app)
        .post('/login-user')
        .send({email: 'admin@mail.com', password: '123457'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(401)
            expect(body).toHaveProperty('msg', 'Email/password is wrong!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    
    it('test login failed (null input email and password)', (done) => {
        request(app)
        .post('/login-user')
        .send({email: '', password: ''})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Password and email cannot be empty!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
})


describe('GET /users', () => {
    it('get users success', (done) => {
        request(app)
        .get('/users')
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            const expected = [
                {
                    "id": customerId,
                    "name": "customer",
                    "email": "customer@mail.com",
                    "unit": "9A / C2"
                }
            ];
            expect(status).toBe(200)
            expect(body).toEqual(expect.arrayContaining(expected))
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('use customer token (failed)', (done) => {
        request(app)
        .get('/users')
        .set({ access_token: customerToken })
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
})

describe('Get user by id, GET /users:id', () => {
    it('get users success', (done) => {
        request(app)
        .get('/users/' + customerId)
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(200)
            expect(body).toEqual({
                id: customerId,
                name: "customer",
                email: "customer@mail.com",
                unit: "9A / C2",
                role: "customer",
                updatedAt: expect.any(String),
                createdAt: expect.any(String)
            })
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('customer get his/her own user info', (done) => {
        request(app)
        .get('/users/' + customerId)
        .set({ access_token: customerToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(200)
            expect(body).toEqual({
                id: customerId,
                name: "customer",
                email: "customer@mail.com",
                unit: "9A / C2",
                role: "customer",
                updatedAt: expect.any(String),
                createdAt: expect.any(String)
            })
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('customer get other user (failed)', (done) => {
        request(app)
        .get('/users/' + dummyId)
        .set({ access_token: customerToken })
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
    it('user not found (failed)', (done) => {
        request(app)
        .get('/users/' + (customerId + 100))
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(404)
            expect(body).toEqual({ msg: 'user not found!' })
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('user id not valid (failed)', (done) => {
        request(app)
        .get('/users/' + customerId + 's')
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toEqual({ msg: 'user ID is not valid!' })
            done()
        })
        .catch(err => {
            done(err)
        })
    })
})

// ExponentPushToken
describe('register token, PUT /users/register-token/:id', () => {
    it('success register token (success)', (done) => {
        request(app)
        .put('/users/register-token/' + customerId)
        .send({userToken: 'ExponentPushToken[h38YMIC-3v8pKEXvjuOB-O]'})
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(200)
            expect(body).toHaveProperty('msg', 'Register user token success!')
            expect(body).toHaveProperty('userToken', 'ExponentPushToken[h38YMIC-3v8pKEXvjuOB-O]')
            done()
        })
        .catch(err => {
            done(err)
        })
    })

    it('user Id is not valid (failed)', (done) => {
        request(app)
        .put('/users/register-token/sasd' + customerId)
        .send({userToken: 'ExponentPushToken[h38YMIC-3v8pKEXvjuOB-O]'})
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'user ID is not valid!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })

    it('expo token is not valid (failed)', (done) => {
        request(app)
        .put('/users/register-token/' + customerId)
        .send({userToken: '[h38YMIC-3v8pKEXvjuOB-O]'})
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'expo token is not valid!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })

    it('user not found! (failed)', (done) => {
        request(app)
        .put('/users/register-token/' + (customerId + 100))
        .send({userToken: 'ExponentPushToken[h38YMIC-3v8pKEXvjuOB-O]'})
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('msg', 'user not found!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
})

describe('register token, PUT /users/send-notification', () => {
    // it('send-notification (success)', (done) => {
    //     request(app)
    //     .post('/users/send-notification')
    //     .send({
    //         sender: 'GoFood',
    //         receiver: 'Pak Desta',
    //         description: 'Masakan padang',
    //         userId: customerId
    //     })
    //     .set({ access_token: adminToken })
    //     .then(response => {
    //         const { status, body } = response
    //         // expect(body).toHaveProperty('msg', 'Register user token success!')
    //         expect(status).toBe(200)
    //         done()
    //     })
    //     .catch(err => {
    //         done(err)
    //     })
    // })

    it('user not found (failed)', (done) => {
        request(app)
        .post('/users/send-notification')
        .send({
            sender: 'GoFood',
            receiver: 'Pak Desta',
            description: 'Masakan padang',
            userId: customerId + 100
        })
        .set({ access_token: adminToken })
        .then(response => {
            const { status, body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('msg', 'user not found!')
            done()
        })
        .catch(err => {
            done(err)
        })
    })
})
