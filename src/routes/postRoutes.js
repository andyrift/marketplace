const express = require('express');
const postController = require('../controllers/postController.js');
const auth = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/', postController.post_post);

//router.get('/doStuff', postController.doStuff);

router.get('/create', auth.requireAuth,  postController.createPost_get);

router.post('/create', auth.requireAuth,  postController.createPost_post);

router.get('/edit/:id', auth.requireAuth, postController.updatePost_get);

router.post('/edit/:id', auth.requireAuth, postController.updatePost_post);

router.delete('/edit/:id', auth.requireAuth, postController.deletePicture_delete);

router.get('/:id', postController.post_get);

router.delete('/:id', auth.requireAuth, postController.post_delete);

router.post('/block/:id', auth.requireAuth, postController.blockPost_post);

module.exports = router;