const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const deviceRoutes = require('./routes/device')
const analysisRoutes = require('./routes/analysis')
const { ok } = require('./utils/response')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api', deviceRoutes)
app.use('/api', analysisRoutes)

app.get('/', (req, res) => {
  ok(res, { message: 'Welcome to Tennis API' })
})

module.exports = app
