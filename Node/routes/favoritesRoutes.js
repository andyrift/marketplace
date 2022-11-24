const express = require('express');
const favoritesController = require('../controllers/favoritesController.js');

const router = express.Router();

router.get('/',  favoritesController.favoritesPage_get);

router.post('/',  favoritesController.favorites_post);

module.exports = router;