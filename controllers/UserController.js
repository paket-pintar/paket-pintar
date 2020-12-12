const { User } = require('../models')
const { checkPassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')

class UserController {
  static async register(req, res, next) {
    const { name, password, email } = req.body
    const payload = { name, password, email }
    try {
      const user = await User.create(payload)
      res.status(201).json({id: user.id, name: user.name, email: user.email, role: user.role})
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    const { password, email } = req.body
    try {
      // const user = await User.create(payload)
      if (!password && !email) {
        throw { msg: 'Password and email cannot be empty!', status: 400 }
      } else {
        const user = await User.findOne({ where: { email: email }})
        if (!user) {
          throw { msg: 'Email/password is wrong!', status: 401}
        } else if (!checkPassword(password, user.password)) {
          throw { msg: 'Email/password is wrong!', status: 401}
        } else {
          const payload = {
            email: user.email,
            role: user.role
          }
          const access_token = signToken(payload)
          res.status(200).json({ access_token })
        }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController