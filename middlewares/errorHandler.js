module.exports = function errorHandler(err, req, res, next) {
  console.log(err, 'errorhandler');
  let msg = err.msg || 'internal server error'
  let status = err.status || 500
  if (err.name === 'SequelizeUniqueConstraintError') {
    msg = err.errors[0].message
    status = 400
  }
  res.status(status).json({msg})
}