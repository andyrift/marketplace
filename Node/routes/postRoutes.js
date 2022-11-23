const express = require('express');
const postController = require('../controllers/postController.js');

const router = express.Router();

router.get('/create',  postController.createPost_get);

router.post('/create', postController.createPost_post);

router.get('/edit/:id', postController.updatePost_get);

router.post('/edit/:id', postController.updatePost_post);

router.get('/:id', postController.post_get);

router.post('/', postController.getPosts_post);

router.delete('/:id', postController.post_delete);

module.exports = router;