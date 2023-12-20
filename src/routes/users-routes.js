const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/user/register', userController.registerUser);
router.post('/user/login', userController.loginUser);
router.post('/user/email-reset', userController.generateEmail);
router.post('/user/resetpassword', userController.resetPassword);

module.exports = router;