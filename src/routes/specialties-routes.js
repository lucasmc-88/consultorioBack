const express = require('express')
const router = express.Router();
const specialtyController = require('../controllers/specialtyController')
const auth = require('../middleware/authMiddleware')


//router.get('/specialty', specialtyController.getSpecialty)
router.get('/specialty',auth, specialtyController.getSpecialty)

module.exports = router;