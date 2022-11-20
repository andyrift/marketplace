const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.get('/profile/edit/:username', userController.updateUser_get);

router.get('/profile/:username', userController.user_get);

router.post('/register', userController.createUser_post);

router.post('/profile/edit/:username', userController.updateUser_post);

router.delete('/profile/:username', userController.user_delete);

module.exports = router;