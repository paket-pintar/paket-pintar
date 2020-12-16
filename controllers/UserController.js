const { User } = require('../models')
const { checkPassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const axios = require('axios')

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
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
          throw { msg: 'Email/password is wrong!', status: 401 }
        } else if (user.role === 'customer' && checkPassword(password, user.password)) {
          const payload = {
            email: user.email,
            name: user.name,
            unit: user.unit,
            id: user.id
          }
          const access_token = signToken(payload)
          res.status(200).json({ ...payload, access_token })
        } else {
          throw { msg: 'Email/password is wrong!', status: 401 }
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
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
          throw { msg: 'Email/password is wrong!', status: 401 }
        } else if (user.role === 'admin' && checkPassword(password, user.password)) {
          const payload = {
            email: user.email,
            role: user.role
          }
          const access_token = signToken(payload)
          res.status(200).json({ ...payload, access_token })
        } else {
          throw { msg: 'Email/password is wrong!', status: 401 }
        }
      }
    } catch (err) {
      next(err)
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        where: { role: 'customer' },
        order: [
          ['createdAt', 'DESC']
        ],
        attributes: ['id', 'name', 'email', 'unit']
      })
      if (users.length === 0) {
        throw { msg: 'there is no user in the list.', status: 200 }
      } else {
        res.status(200).json(users)
      }
    } catch (err) {
      next(err)
    }
  }

  static async getUserById(req, res, next) {
    const id = +req.params.id
    const { id: UserId, role } = req.userLoggedIn
    try {
      if (isNaN(id)) {
        throw { msg: 'user ID is not valid!', status: 400 }
      } else {
        if (UserId == id || role === 'admin') {
          const user = await User.findByPk(id,
            {
              attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt', 'unit']
            })
          if (!user) {
            throw { msg: 'user not found!', status: 404 }
          } else {
            res.status(200).json(user)
          }
        } else {
          throw { msg: 'not authorized!', status: 401 }
        }
      }
    } catch (err) {
      next(err)
    }
  }

  static async registerToken(req, res, next) {
    const id = +req.params.id
    const userToken = req.body.userToken

    try {
      if (isNaN(id)) {
        throw { msg: 'user ID is not valid!', status: 400 }
      } else if (!userToken.includes('ExponentPushToken')) {
        throw { msg: 'expo token is not valid!', status: 400 }
      } else {
        const user = await User.update({ userToken }, { where: { id }, returning: true })
        if (user[0] === 0) {
          throw { msg: 'user not found!', status: 404 }
        } else {
          res.status(200).json({ msg: 'Register user token success!', userToken })
        }
      }
    } catch (error) {
      next(error)
    }
  }

  static async sendNotification(req, res, next) {
    let { description, sender, userId } = req.body
    // console.log('req.body:', description, sender, userId);
    try {
      let user = await User.findByPk(userId)
      if (!user) {
        throw { msg: 'user not found!', status: 404 }
      } else {
        let token = user.userToken
  
        const message = {
          to: token,
          sound: 'default',
          title: `Kiriman dari: ${sender}`,
          body: description,
          data: { description, sender },
        };
        let dataFeedback = await axios({
          url: 'https://exp.host/--/api/v2/push/send',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(message),
        });
        // console.log(dataFeedback);
        console.log('dataFeedback.config', dataFeedback.config.data);
        res.status(200).json(dataFeedback.config.data)
      }
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
}

module.exports = UserController