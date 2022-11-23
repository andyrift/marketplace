const express = require('express');
const favoritesController = require('../controllers/favoritesController.js');

const router = express.Router();

router.get('/',  favoritesController.favoritesPage_get);

router.post('/',  favoritesController.getFavorites_post);

router.delete('/',  favoritesController.deleteFavorite_delete);

router.post('/add', favoritesController.addFavorite_post);

module.exports = router;