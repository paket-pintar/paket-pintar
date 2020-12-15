if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res, next) => {
  res.send('Welcome to Paket Pintar API')
})

app.use(routes)
app.use(errorHandler)

app.listen(port, () => {
  console.log('listening to port: ' + port);
})

module.exports = app