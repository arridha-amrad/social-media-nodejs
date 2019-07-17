const express = require('express');
const { signup } = require('../controllers/auth');
const router = express.Router();
const {userSignUpValidator} = require('../validator/index');

router.post("/signup", userSignUpValidator, signup);

module.exports = router;