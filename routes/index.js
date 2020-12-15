const router = require('express').Router()
const packagesRouter = require('./packages')
const usersRouter = require('./users')
const historiesRouter = require('./histories')
const UserController = require('../controllers/UserController')
const authentication = require('../middlewares/authentication')

router.post('/register', UserController.register)
router.post('/login-admin', UserController.loginAdmin)
router.post('/login-user', UserController.loginUser)

router.use(authentication)
router.use('/users', usersRouter)
router.use('/packages', packagesRouter)
router.use('/histories', historiesRouter)

module.exports = router