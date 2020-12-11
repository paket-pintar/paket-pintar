const router = require('express').Router()
const PackageController = require('../controllers/PackageController')
const authentication = require('../middlewares/authentication')

router.use(authentication)
router.get('/', PackageController.getAllPackage)
router.get('/:id', PackageController.getPackageById)
router.post('/', PackageController.createPackage)
router.put('/:id', PackageController.updatePackage)
router.delete('/:id', PackageController.deletePackage)

module.exports = router