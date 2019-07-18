const express = require('express');
const { signup, signin, signout } = require('../controllers/auth');
const router = express.Router();
const { userSignUpValidator } = require('../validator/index');
const { userById } = require('../controllers/user');

router.post("/signup", userSignUpValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any routes containing userId, our app will execute userById first
router.param("userId", userById);

module.exports = router;
