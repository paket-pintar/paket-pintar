const router = require('express').Router()
const HistoryController = require('../controllers/HistoryController')
const adminAuthorization = require('../middlewares/adminAuthorization')

router.get('/', adminAuthorization, HistoryController.getAllHistory)
router.get('/:id', adminAuthorization, HistoryController.getHistoryById)


module.exports = router