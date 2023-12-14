const express = require('express')
const router = express.Router();
const appointmentController = require('../controllers/appointmentController')
const auth = require('../middleware/authMiddleware')

//router.get('/appointment',auth, appointmentController.getappointment);
//router.get('/appointment/detail/:dId', appointmentController.detailappointment);
router.post('/appointment/create', appointmentController.createAppoinment);
router.patch('/appointment/update/:aId',auth, appointmentController.UpdateAppoinment);

module.exports = router;