const jwt = require('jsonwebtoken')

function signToken(payload) {
  const token = jwt.sign(payload, process.env.SECRET)
  return token
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET)
}

module.exports = {
  verifyToken,
  signToken
}