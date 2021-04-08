const express = require('express')
const router = express.Router()

const {
  getPosition
} = require('./controllers/GeocodeController')

router.post('/geo', getPosition)

module.exports = router
