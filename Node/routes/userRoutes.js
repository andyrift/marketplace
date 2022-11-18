const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.get('/profile/:id', userController.user_get);

router.post('/register', userController.user_post);

module.exports = router;