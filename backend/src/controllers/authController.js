const jwt = require('jsonwebtoken')
const { run, get } = require('../db')
const config = require('../config')
const { ok, error } = require('../utils/response')

const register = async (req, res) => {
  const { openid, nickname, avatar, ai_api_key } = req.body || {}
  if (!openid) return error(res, 400, '请输入 openid')
  const existing = await get('SELECT id FROM users WHERE openid = ?', [openid])
  if (existing) return error(res, 400, '用户已存在')
  const extInfo = JSON.stringify({ level: '初级球员', handedness: '右手持拍' })
  const result = await run(
    'INSERT INTO users (openid, nickname, avatar, ai_api_key, ext_info) VALUES (?, ?, ?, ?, ?)',
    [openid, nickname || null, avatar || null, ai_api_key || null, extInfo]
  )
  return ok(res, { user: { id: result.lastID, openid, nickname, avatar } })
}

const login = async (req, res) => {
  const { openid } = req.body || {}
  if (!openid) return error(res, 400, '请输入 openid')
  const user = await get('SELECT * FROM users WHERE openid = ?', [openid])
  if (!user) return error(res, 400, '用户不存在')
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' })
  return ok(res, {
    token,
    user: { id: user.id, openid: user.openid, nickname: user.nickname, avatar: user.avatar }
  })
}

const me = async (req, res) => {
  const user = await get(
    'SELECT id, openid, nickname, avatar, ai_api_key, create_time, update_time, ext_info FROM users WHERE id = ?',
    [req.userId]
  )
  if (!user) return error(res, 404, '用户不存在')
  const profile = user.ext_info ? JSON.parse(user.ext_info) : {}
  delete user.ext_info
  return ok(res, { user, profile })
}

module.exports = {
  register,
  login,
  me
}
