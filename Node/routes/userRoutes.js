const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.get('/:id', userController.user_get);

module.exports = router;