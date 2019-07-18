const express = require('express');
const router = express.Router();
const { userById, allUsers, getUser, updateUser, deleteUser } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

// any route contain userId, our app will first execute userById
router.param('userId', userById);

// Semua orang dapat melihat daftar pengguna
router.get('/users', allUsers);
// Get specific user based on Id
router.get('/user/:userId', requireSignin, getUser);
// Update user profile
router.put('/user/:userId', requireSignin, updateUser);
// Delete a user
router.delete('/user/:userId', requireSignin, deleteUser)



module.exports = router;
