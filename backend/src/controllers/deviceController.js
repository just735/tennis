const { ok } = require('../utils/response')

const getDeviceData = (req, res) => {
  const data = {
    racket: {
      speed: Math.floor(Math.random() * (150 - 80) + 80),
      count: Math.floor(Math.random() * 200),
      aceCount: Math.floor(Math.random() * 20)
    },
    foot: {
      distance: Math.floor(Math.random() * (80 - 30) + 30),
      heatmap: 'mock_heatmap_data'
    }
  }
  return ok(res, data)
}

module.exports = {
  getDeviceData
}
