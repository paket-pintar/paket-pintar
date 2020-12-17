const { User } = require('../models')
const { verifyToken } = require('../helpers/jwt')

module.exports = async function (req, res, next) {
  const { access_token } = req.headers
  try {
    if (!access_token) {
      throw { msg: 'not authenticated!', status: 401 }
    } else {
      const decodedToken = verifyToken(access_token)
      const user = await User.findOne({ where: { email: decodedToken.email }})
      if (!user) {
        throw { msg: 'not authenticated!', status: 401 }
      }
      req.userLoggedIn = {
        role: user.role,
        id: user.id
      }
      next()
    }
  } catch (err) {
    next(err)
  }
}