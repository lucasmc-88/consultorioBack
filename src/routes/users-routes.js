const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware')



router.post('/user/register', userController.registerUser);
router.post('/user/login', userController.loginUser);
router.post('/user/logout',auth, userController.logout);
router.post('/user/email-reset', userController.generateEmail);
router.post('/user/resetpassword', userController.resetPassword);

module.exports = router;