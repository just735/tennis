const jwt = require('jsonwebtoken')
const config = require('../config')
const { error } = require('../utils/response')

const auth = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return error(res, 401, '未登录')
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    req.userId = payload.userId
    return next()
  } catch (e) {
    return error(res, 401, '登录已过期')
  }
}

module.exports = auth
