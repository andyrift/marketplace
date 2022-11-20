const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.get('/profile/:username', userController.user_get);

router.post('/register', userController.user_post);

router.delete('/profile/:username', userController.user_delete);

module.exports = router;