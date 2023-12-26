const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware')
const { check } = require("express-validator");


router.post('/user/register', [
    check('name').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').notEmpty().isEmail().withMessage('El correo electrónico es obligatorio y debe ser válido'),
    check('password').notEmpty().isLength({ min: 6 }).withMessage('La contraseña es obligatoria y debe tener al menos 6 caracteres'),
], userController.registerUser);

router.post('/user/login', [
    check('email').notEmpty().isEmail().withMessage('El correo electrónico es obligatorio y debe ser válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
], userController.loginUser);

router.post('/user/logout', auth, userController.logout);


router.post('/user/email-reset', [
    check('email').notEmpty().isEmail().withMessage('El correo electrónico es obligatorio y debe ser válido'),
], userController.generateEmail);


router.post('/user/resetpassword', userController.resetPassword);

module.exports = router;