const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const { response } = require('express')

const user = [{
    name: 'Admin',
    email: 'admin@mail.com',
    password: hashPassword('123456'),
    createdAt: new Date(),
    updatedAt: new Date()
}]

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

describe('POST /register', () => {
    it('test register success', (done) => {
        request(app)
        .post('/register')
        .send({name: 'Admin2', email: 'admin2@mail.com', password: '123456'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(201)
            expect(body).toHaveProperty("id", expect.any(Number))
            expect(body).toHaveProperty("name", expect.any(String))
            expect(body).toHaveProperty("email", expect.any(String))
            expect(body).toHaveProperty("role", expect.any(String))   
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('test register failed (username empty)', (done) => {
        request(app)
        .post('/register')
        .send({name: '', email: 'admin2@mail.com', password: '123456'})
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
        .send({name: 'user', email: '', password: '123456'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Email cannot be empty!, Please use email format!')
            done()
        })
        .catch(err => {
            done(err)
        })     
    })
    it('tes register failed (not use email format)', (done) => {
        request(app)
        .post('/register')
        .send({name: 'user', email: 'usercom', password: '123456'})
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
        .send({name: 'user', email: 'user@mail.com', password: ''})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(400)
            expect(body).toHaveProperty('msg', 'Password cannot be empty!, Password length minimum 6 characters!')
            done()
        })
        .catch(err => {
            done(err)
        })     
    })
    it('tes register failed (password below 6 characters)', (done) => {
        request(app)
        .post('/register')
        .send({name: 'user', email: 'user@mail.com', password: '123'})
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
})

describe('POST /login', () => {
    it('test login success', (done) => {
        request(app)
        .post('/login')
        .send({email: 'admin@mail.com', password: '123456'})
        .then(response => {
            const { status, body } = response
            expect(status).toBe(200)
            expect(body).toHaveProperty('access_token', expect.any(String))
            done()
        })
        .catch(err => {
            done(err)
        })
    })
    it('test login failed (wrong email)', (done) => {
        request(app)
        .post('/login')
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
        .post('/login')
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
})
