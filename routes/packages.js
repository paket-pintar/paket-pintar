const router = require('express').Router()
const PackageController = require('../controllers/PackageController')
const authentication = require('../middlewares/authentication')
const adminAuthorization = require('../middlewares/adminAuthorization')

router.use(authentication)
router.get('/', PackageController.getAllPackage)
router.get('/:id', PackageController.getPackageById)
router.post('/',adminAuthorization, PackageController.createPackage)
router.put('/:id',adminAuthorization, PackageController.updatePackage)
router.delete('/:id',adminAuthorization, PackageController.deletePackage)

module.exports = router