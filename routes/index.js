const router = require('express').Router()
const packageRouter = require('./packages')
const UserController = require('../controllers/UserController')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use('/packages', packageRouter)

module.exports = router