const request = require('supertest')
const app = require('../app')

describe('Test default endpoint, GET /', () => {
  test('test endpoint default success', (done) => {
    request(app)
      .get('/')
      .then(response => {
        let { body, status } = response
        // expect(status).toBe(200)
        expect(body).toEqual('Welcome to Paket Pintar API')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})