module.exports = function (req, res, next) {
  const { role } = req.userLoggedIn
  try {
    if (role !== 'admin') {
      throw { msg: 'not authorized!', status: 401 }
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}