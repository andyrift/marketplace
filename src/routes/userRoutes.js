const express = require('express');
const userController = require('../controllers/userController.js');
const auth = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/profile', auth.requireAuth, userController.profile_get);

router.get('/profile/edit', auth.requireAuth, userController.updateProfile_get);

router.post('/profile/edit', auth.requireAuth, userController.updateProfile_post);

router.delete('/profile/edit/', auth.requireAuth, userController.deletePicture_delete);

router.delete('/profile', auth.requireAuth, userController.profile_delete);

router.get('/user/:username', userController.user_get);

router.post('/user/:username', auth.requireAuth, userController.user_post);

router.post('/user/block/:username', auth.requireAuth, userController.blockUser_post);

router.get('/doStuff', userController.doStuff);

module.exports = router;