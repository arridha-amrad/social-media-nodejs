const express = require('express');
const router = express.Router();
const { getPosts, createPost, postByUser, postById, isPoster, deletePost } = require('../controllers/post');
const{ requireSignin } = require('../controllers/auth');
const {createPostValidator} = require('../validator');
const { userById } = require('../controllers/user');

//any routes containing :userId, our app will first execute userById()
router.param("userId", userById);
//any routes containing :postId, our app will first execute postById()
router.param("postId", postById);

router.get('/', requireSignin, getPosts);
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.get('/post/by/:userId', requireSignin, postByUser);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

module.exports = router;

