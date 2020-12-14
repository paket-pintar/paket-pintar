const { User, Package } = require('../models')

class PackageController {
  static async getAllPackage (req, res, next) {
    const { id, role } = req.userLoggedIn
    let packages = null
    try {
      if (role === 'admin') {
        packages = await Package.findAll({ include: [{
          model: User,
          attributes: ['id', 'name', 'email'],
          required: true
        }], 
          order: [
            ['id', 'DESC']
          ],
        })
      } else {
        packages = await Package.findAll({ where: { UserId: id },
          order: [
            ['id', 'DESC']
          ]
        })
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
      const thePackage = await Package.findByPk(packageId,{
          include: [{
            model: User,
            attributes: ['id', 'name', 'email']
          }]
        }
      )
      if (isNaN(+packageId)) {
        throw { msg: 'package ID is not valid!', status: 400 }
      } else if (!thePackage) {
        throw { msg: 'package not found!', status: 404 }
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
    const { UserId, description, sender } = req.body
    const payload = {
      UserId, description, sender, 
      claimed: false
    }
    
    try {
      const user = await User.findByPk(UserId)
      if (!user) {
        throw { msg: 'customer not found!', status: 404 }
      } else {
        const newPackage = await Package.create(payload)
        res.status(201).json(newPackage)
      }
    } catch (err) {
      next(err)
    }
  }

  static async updatePackage (req, res, next) {
    const packageId = req.params.id
    const { UserId, description, claimed, sender } = req.body
    const payload = { UserId, description, sender, claimed: claimed == 'true' }
    try {
      if (isNaN(+packageId)) {
        throw { msg: 'package ID is not valid!', status: 400 }
      } else {
        const updatedPackage = await Package.update(payload, { where: { id: packageId }, returning: true })
        if (updatedPackage[0] === 0) {
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
    const packageId = req.params.id
    try {
      if (isNaN(+packageId)) {
        throw { msg: 'package ID is not valid!', status: 400 }
      } else {
        const thePackage = await Package.findByPk(packageId)
        if (!thePackage) {
          throw { msg: 'package not found!', status: 404 }
        } else {
          await Package.destroy({ where: { id: packageId } })
          res.status(200).json({ msg: 'package deleted succesfully!' })
        }
      }
    } catch (err) {
      next(err)
    }
  }

  static async claimPackage (req, res, next) {
    const packageId = req.params.id
    const { claimed } = req.body
    try {
      if (isNaN(+packageId)) {
        throw { msg: 'package ID is not valid!', status: 400 }
      } else {
        const claimedPackage = await Package.update({ claimed: claimed == 'true' }, { where: { id: packageId }, returning: true })
        if (claimedPackage[0] === 0) {
          throw { msg: 'package not found!', status: 404 }
        } else {
          res.status(200).json(claimedPackage[1][0])
        }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = PackageController