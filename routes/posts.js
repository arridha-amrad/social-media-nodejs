const express = require('express');
const router = express.Router();
const { requireSignin } = require('../controllers/auth');
const { createPostValidator } = require('../validator');
const { userById } = require('../controllers/user');
const {
  getPosts,
  createPost,
  postByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  postPhoto,
  singlePost,
  like,
  unlike,
  comment,
  unComment
} = require('../controllers/post');

// like a post
router.put("/post/like", requireSignin, like);
// unlike a post
router.put("/post/unlike", requireSignin, unlike);

// comment
router.put("/post/comment", requireSignin, comment);
//uncomment
router.put("/post/uncomment", requireSignin, unComment)

//any routes containing :userId, our app will first execute userById()
router.param("userId", userById);
//any routes containing :postId, our app will first execute postById()
router.param("postId", postById);
// get all post of users
router.get('/posts', getPosts);
// get photo post
router.get("/post/photo/:postId", postPhoto);
// create a new post
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
// get a post from a specific user
router.get('/posts/by/:userId', requireSignin, postByUser);
// delete a post
router.delete('/post/:postId', requireSignin, isPoster, deletePost);
// update the existing post
router.put('/post/:postId', requireSignin, isPoster, updatePost);
// go to a singlePost
router.get("/post/:postId", singlePost);

module.exports = router;

