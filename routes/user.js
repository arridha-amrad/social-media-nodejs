const express = require('express');
const router = express.Router();
const { userById,
        allUsers, 
        getUser, 
        updateUser, 
        deleteUser, 
        userPhoto, 
        addFollowing, 
        addFollower, 
        removeFollowing, 
        removeFollower,
        findPeople 
      } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

// any route contain userId, our app will first execute userById
router.param("userId", userById);
// add following and followers
router.put("/user/follow", requireSignin, addFollowing, addFollower);
// remove followers and following
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);
// Semua orang dapat melihat daftar pengguna
router.get('/users', allUsers);
// Get specific user based on Id
router.get('/user/:userId', requireSignin, getUser);
// Update user profile
router.put('/user/:userId', requireSignin, updateUser);
// Delete a user
router.delete('/user/:userId', requireSignin, deleteUser);
// photo
router.get("/user/photo/:userId", userPhoto);
// find people
router.get("/user/findPeople/:userId", requireSignin, findPeople);


module.exports = router;

