const router = require('express').Router()
const UserController = require('../controllers/UserController')
const adminAuthorization = require('../middlewares/adminAuthorization')

router.get('/', adminAuthorization, UserController.getAllUsers)
router.get('/:id', UserController.getUserById)


module.exports = router