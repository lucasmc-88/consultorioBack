const express = require('express')
const router = express.Router();
const { check } = require("express-validator");

const doctorController = require('../controllers/doctorController')
const auth = require('../middleware/authMiddleware')

//router.get('/doctor', doctorController.getDoctor);
//router.get('/doctor/detail/:dId', doctorController.detailDoctor);
router.get('/doctor', auth, doctorController.getDoctor);
router.get('/doctor/detail/:dId', auth, doctorController.detailDoctor);
router.post('/doctor/create', auth,
    [
        check('name').notEmpty(),
        check('specialtyId').notEmpty(),

    ], doctorController.createDoctor);
router.patch('/doctor/update/:dId', auth, [
    check('name').notEmpty(),
    check('specialtyId').notEmpty(),
], doctorController.updateDoctor);

module.exports = router;