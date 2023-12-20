const express = require('express')
const router = express.Router();
const appointmentController = require('../controllers/appointmentController')
const auth = require('../middleware/authMiddleware')


router.post('/appointment/create',auth, appointmentController.createAppoinment);
router.patch('/appointment/update/:aId',auth, appointmentController.updateAppoinment);
router.delete('/appointment/delete/:aId',auth, appointmentController.deleteAppoinment);
router.get('/appointment/doctorId/:dId',auth, appointmentController.getAppoinmentByDoctorId);
router.get('/appointments/patient',auth, appointmentController.getAppoinmentByPatient);
router.get('/appointments/cancel',auth, appointmentController.getCancelByPatient);
router.post('/appointments/reserve/:aId', auth, appointmentController.reserveAppointment);
router.patch('/appointments/cancel/:aId', auth, appointmentController.cancelAppointment);
module.exports = router;