const express = require('express');
const { signup, signin } = require('../controllers/auth');
const router = express.Router();
const {userSignUpValidator} = require('../validator/index');

router.post("/signup", userSignUpValidator, signup);
router.post("/signin", signin);

module.exports = router;