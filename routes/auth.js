const express = require('express');
const { 
  signup, 
  signin, 
  signout,
  forgotPassword,
  resetPassword,
  socialLogin
 } = require('../controllers/auth');
const router = express.Router();
const { 
  userSignUpValidator, 
  userSignInValidator,
  passwordResetValidator
  } = require('../validator/index');

const { userById } = require('../controllers/user');
// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);
router.post("/social-login", socialLogin);

router.post("/signup", userSignUpValidator, signup);
router.post("/signin", userSignInValidator, signin);
router.get("/signout", signout);


// any routes containing userId, our app will execute userById first
router.param("userId", userById);

module.exports = router;
