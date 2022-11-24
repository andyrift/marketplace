const express = require('express');
const postController = require('../controllers/postController.js');

const router = express.Router();

router.get('/create',  postController.createPost_get);

router.post('/', postController.post_post);

router.get('/edit/:id', postController.updatePost_get);

router.get('/:id', postController.post_get);

router.delete('/:id', postController.post_delete);

module.exports = router;