const router = require('express').Router()
const { Watch } = require('../models')

router.use('/api', require('./watchController.js'))



module.exports = router