const { User, Package } = require('../models')

class PackageController {
  static async getAllPackage (req, res, next) {
    const { id, role } = req.userLoggedIn
    let packages = null
    try {
      if (role === 'admin') {
        packages = await Package.findAll({ include: [User] })
      } else {
        packages = await Package.findAll({ where: { UserId: id } })
      }  
      res.status(200).json(packages)
    } catch (err) {
      next(err)
    }
  }

  static async getPackageById (req, res, next) {
    const { id, role } = req.userLoggedIn
    const packageId = req.params.id
    try {
      const thePackage = await Package.findByPk(packageId)
      if (isNaN(+packageId)) {
        throw { msg: 'package ID is not valid!', status: 400 }
      } else if (!thePackage) {
        throw { msg: 'not found!', status: 404 }
      } else if (role === 'admin' || +id === +thePackage.UserId) {
        res.status(200).json(thePackage)
      } else {
        throw { msg: 'not authorized', status: 404 }
      }
    } catch (err) {
      next(err)
    }
  }

  static async createPackage (req, res, next) {
    const { role } = req.userLoggedIn
    const { UserId, description, sender } = req.body
    const payload = {
      UserId, description, sender, 
      claimed: false
    }
    // console.log(UserId, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< user logged in')
    try {
      if (role !== 'admin') {
        throw { msg: 'not authorized!', status: 401 }
      } else {
        const user = await User.findByPk(UserId)
        if (!user) {
          throw { msg: 'customer not found!', status: 404 }
        } else {
          const newPackage = await Package.create(payload)
          res.status(201).json(newPackage)
        }
      }
    } catch (err) {
      next(err)
    }
  }

  static async updatePackage (req, res, next) {
    const { role } = req.userLoggedIn
    const packageId = req.params.id
    const { UserId, description, claimed } = req.body
    const payload = { UserId, description, claimed: claimed == 'true' }
    try {
      if (isNaN(+packageId)) {
        throw { msg: 'package ID is not valid!', status: 400 }
      } else if (role !== 'admin') {
        throw { msg: 'not authorized!', status: 401 }
      } else {
        const updatedPackage = await Package.update(payload, { where: { id: packageId }, returning: true })
        if (updatedPackage[0] === 0) {
          console.log(updatedPackage);
          throw { msg: 'package not found!', status: 404 }
        } else {
          res.status(200).json(updatedPackage[1][0])
        }
      }
    } catch (err) {
      next(err)
    }
  }

  static async deletePackage (req, res, next) {
    const { role } = req.userLoggedIn
    const packageId = req.params.id
    try {
      if (isNaN(+packageId)) {
        throw { msg: 'package ID is not valid!', status: 400 }
      } else if (role !== 'admin') {
        throw { msg: 'not authorized!', status: 401 }
      } else {
        const thePackage = await Package.findByPk(packageId)
        if (!thePackage) {
          throw { msg: 'package not found!', status: 404 }
        } else {
          const deletedPackage = await Package.destroy({ where: { id: packageId }, returning: true })
          res.status(200).json(deletedPackage)
        }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = PackageController