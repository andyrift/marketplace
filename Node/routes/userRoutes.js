const express = require('express');
const userController = require('../controllers/userController.js');
const auth = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/profile', auth.requireAuth, userController.profile_get);

router.get('/profile/edit', auth.requireAuth, userController.updateProfile_get);

router.post('/profile/edit', auth.requireAuth, userController.updateProfile_post);

router.delete('/profile', auth.requireAuth, userController.profile_delete);

router.get('/user/:username', userController.user_get);

router.post('/user/:username', auth.requireAuth, userController.user_post);

module.exports = router;