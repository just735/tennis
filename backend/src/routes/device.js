const express = require('express')
const deviceController = require('../controllers/deviceController')

const router = express.Router()

router.get('/device-data', deviceController.getDeviceData)

module.exports = router
