const express = require('express')
const weatherController = require('../controllers/weather')

const router = new express.Router()

router.get('/weather', weatherController.getWeather)

module.exports = router