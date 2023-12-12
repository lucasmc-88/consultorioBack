const express = require('express')
const router = express.Router();
const specialtyController = require('../controllers/specialtyController')

router.get('/specialty', specialtyController.getSpecialty)

module.exports = router;