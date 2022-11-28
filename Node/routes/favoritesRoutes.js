const express = require('express');
const favoritesController = require('../controllers/favoritesController.js');
const auth = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/', auth.requireAuth,  favoritesController.favoritesPage_get);

router.post('/', auth.requireAuth,  favoritesController.favorites_post);

module.exports = router;