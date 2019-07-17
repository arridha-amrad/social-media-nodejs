const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const {createPostValidator} = require('../validator');

router.get('/', postController.getPosts);
router.post('/post', createPostValidator, postController.createPost);

module.exports = router;
