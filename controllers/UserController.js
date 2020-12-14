const { User } = require('../models')
const { checkPassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')

class UserController {
  static async register(req, res, next) {
    const { name, password, email, unit } = req.body
    const payload = { name, password, email, unit }
    try {
      const user = await User.create(payload, { attributes: ['id', 'name', 'email', 'unit'], returning: true })
      const createdUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        unit: user.unit
      }
      res.status(201).json(createdUser)
    } catch (err) {
      next(err)
    }
  }

  static async loginUser(req, res, next) {
    const { password, email } = req.body
    try {
      // const user = await User.create(payload)
      if (!password && !email) {
        throw { msg: 'Password and email cannot be empty!', status: 400 }
      } else {
        const user = await User.findOne({ where: { email: email }})
        if (!user) {
          throw { msg: 'Email/password is wrong!', status: 401}
        } else if (user.role === 'customer' && checkPassword(password, user.password)) {
          const payload = {
            email: user.email,
            role: user.role
          }
          const access_token = signToken(payload)
          res.status(200).json({ ...payload, access_token })
        } else {
          throw { msg: 'Email/password is wrong!', status: 401}
        }
      }
    } catch (err) {
      next(err)
    }
  }

  static async loginAdmin(req, res, next) {
    const { password, email } = req.body
    try {
      // const user = await User.create(payload)
      if (!password && !email) {
        throw { msg: 'Password and email cannot be empty!', status: 400 }
      } else {
        const user = await User.findOne({ where: { email: email }})
        if (!user) {
          throw { msg: 'Email/password is wrong!', status: 401}
        } else if (user.role === 'admin' && checkPassword(password, user.password)) {
          const payload = {
            email: user.email,
            role: user.role
          }
          const access_token = signToken(payload)
          res.status(200).json({ ...payload, access_token })
        } else {
          throw { msg: 'Email/password is wrong!', status: 401}
        }
      }
    } catch (err) {
      next(err)
    }
  }
  
  static async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({ where: { role: 'customer' }, 
        order: [
          ['createdAt', 'DESC']
        ],
        attributes: ['id', 'name', 'email', 'unit']
      })
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }

  static async getUserById(req, res, next) {
    const UserId = +req.params.id
    const { id, role } = req.userLoggedIn
    try {
      if (isNaN(+id)) {
        throw { msg: 'user ID is not valid!', status: 400 }
      } else {
        if (UserId !== id && role !== 'admin') {
          throw { msg: 'not authorized!', status: 400 }
        } else {
          const user = await User.findByPk(id, 
            { attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt', 'unit'] 
          })
          if (!user) {
            throw { msg: 'user not found!', status: 404 }
          } else {
            res.status(200).json(user)
          }
        }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController