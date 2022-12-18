const express = require('express');
const mesagesController = require('../controllers/messagesController.js');
const auth = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/blacklist', auth.requireAuth, (req, res) => {
	res.render('blacklist', { title: 'Blacklist' });
});

router.get('/messages/', auth.requireAuth, (req, res) => {
	res.render('messages', { title: 'Messages' });
});

router.get('/chat/:id', auth.requireAuth, mesagesController.chat_get);

router.post('/blacklist', auth.requireAuth, mesagesController.blacklist_post);

router.post('/messages', auth.requireAuth, mesagesController.messages_post);

router.post('/chat', auth.requireAuth, mesagesController.chat_post);

router.post('/chat/:id', auth.requireAuth, mesagesController.chat_post);

module.exports = router;

