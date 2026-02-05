const express = require('express')
const analysisController = require('../controllers/analysisController')

const router = express.Router()

router.post('/analysis/report', analysisController.report)
router.get('/analysis/suggestion', analysisController.suggestion)

module.exports = router
