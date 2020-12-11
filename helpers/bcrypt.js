const bcrypt = require('bcryptjs')

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(+process.env.SALT)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

function checkPassword(password, hash) {
  return bcrypt.compareSync(password,hash)
}

module.exports = {
  hashPassword,
  checkPassword
}