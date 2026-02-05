const ok = (res, data = {}) => {
  res.json(data)
}

const error = (res, status, message) => {
  res.status(status).json({ message })
}

module.exports = {
  ok,
  error
}
