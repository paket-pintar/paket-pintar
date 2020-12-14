const router = require('express').Router()
const PackageController = require('../controllers/PackageController')
const adminAuthorization = require('../middlewares/adminAuthorization')

router.get('/', PackageController.getAllPackage)
router.get('/:id', PackageController.getPackageById)
router.post('/', adminAuthorization, PackageController.createPackage)
router.put('/:id', adminAuthorization, PackageController.updatePackage)
router.patch('/:id', adminAuthorization, PackageController.claimPackage)
router.delete('/:id', adminAuthorization, PackageController.deletePackage)

module.exports = router