const express = require('express')
const router = express.Router();
const doctorController = require('../controllers/doctorController')
const auth = require('../middleware/authMiddleware')

router.get('/doctor',auth, doctorController.getDoctor);
router.get('/doctor/detail/:dId', doctorController.detailDoctor);
router.post('/doctor/create',auth, doctorController.createDoctor);
router.patch('/doctor/update/:dId',auth, doctorController.updateDoctor);

module.exports = router;