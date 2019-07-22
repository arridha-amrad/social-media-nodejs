const express = require('express');
const { signup, signin, signout } = require('../controllers/auth');
const router = express.Router();
const { userSignUpValidator, userSignInValidator } = require('../validator/index');
const { userById } = require('../controllers/user');

router.post("/signup", userSignUpValidator, signup);
router.post("/signin", userSignInValidator, signin);
router.get("/signout", signout);

// any routes containing userId, our app will execute userById first
router.param("userId", userById);

module.exports = router;
