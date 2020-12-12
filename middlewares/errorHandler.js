module.exports = function errorHandler(err, req, res, next) {
  // console.log(err, 'errorhandler');
  let msg = err.msg || 'internal server error'
  let status = err.status || 500
  if (err.name === 'SequelizeUniqueConstraintError') {
    msg = 'Email already taken!'
    status = 400
  } else if (err.name === 'SequelizeValidationError') {
    msg = err.errors[0].message
    status = 400
  }
  res.status(status).json({msg})
}