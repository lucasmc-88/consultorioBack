const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware')

// Endpoint para crear un usuario
router.post('/user/register',auth, userController.registerUser);
router.post('/user/login', userController.loginUser);

module.exports = router;