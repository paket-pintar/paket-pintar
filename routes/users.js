const router = require('express').Router()
const UserController = require('../controllers/UserController')
const adminAuthorization = require('../middlewares/adminAuthorization')

router.get('/', adminAuthorization, UserController.getAllUsers)
router.get('/:id', UserController.getUserById)
router.post('/send-notification', adminAuthorization, UserController.sendNotification)
router.put('/register-token/:id', UserController.registerToken)

module.exports = router