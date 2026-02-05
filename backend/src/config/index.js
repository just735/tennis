const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const config = {
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'tennis.db')
}

module.exports = config
