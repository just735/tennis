const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { run, get } = require('../db')
const config = require('../config')
const { ok, error } = require('../utils/response')

const register = async (req, res) => {
  const { username, password, phone } = req.body || {}
  if (!username || !password) return error(res, 400, '请输入用户名和密码')
  if (password.length < 6) return error(res, 400, '密码至少 6 位')
  const existing = await get('SELECT id FROM users WHERE username = ?', [username])
  if (existing) return error(res, 400, '用户名已存在')
  const passwordHash = await bcrypt.hash(password, 10)
  const result = await run(
    'INSERT INTO users (username, phone, password_hash) VALUES (?, ?, ?)',
    [username, phone || null, passwordHash]
  )
  await run(
    'INSERT INTO user_profiles (user_id, level, handedness) VALUES (?, ?, ?)',
    [result.lastID, '初级球员', '右手持拍']
  )
  return ok(res, { user: { id: result.lastID, username } })
}

const login = async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return error(res, 400, '请输入用户名和密码')
  const user = await get('SELECT * FROM users WHERE username = ?', [username])
  if (!user) return error(res, 400, '账号或密码错误')
  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) return error(res, 400, '账号或密码错误')
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' })
  return ok(res, { token, user: { id: user.id, username: user.username } })
}

const me = async (req, res) => {
  const user = await get('SELECT id, username, phone, created_at FROM users WHERE id = ?', [req.userId])
  if (!user) return error(res, 404, '用户不存在')
  const profile = await get(
    'SELECT level, handedness, created_at FROM user_profiles WHERE user_id = ?',
    [req.userId]
  )
  return ok(res, { user, profile })
}

module.exports = {
  register,
  login,
  me
}
