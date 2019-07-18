const express = require('express');
const router = express.Router();
const {getPosts, createPost} = require('../controllers/post');
const{ requireSignin } = require('../controllers/auth');
const {createPostValidator} = require('../validator');
const { userById } = require('../controllers/user');

router.get('/', requireSignin, getPosts);
router.post('/post', requireSignin, createPostValidator, createPost);

//any routes containing :userId, our app will first execute userById()
router.param("userId", userById);

module.exports = router;
