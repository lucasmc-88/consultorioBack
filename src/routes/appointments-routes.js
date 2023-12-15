const express = require('express')
const router = express.Router();
const appointmentController = require('../controllers/appointmentController')
const auth = require('../middleware/authMiddleware')

//router.get('/appointment',auth, appointmentController.getappointment);

router.post('/appointment/create',auth, appointmentController.createAppoinment);
router.patch('/appointment/update/:aId',auth, appointmentController.updateAppoinment);
router.delete('/appointment/delete/:aId',auth, appointmentController.deleteAppoinment);
router.get('/appointment/doctorId/:dId', appointmentController.getAppoinmentByDoctorId);

module.exports = router;