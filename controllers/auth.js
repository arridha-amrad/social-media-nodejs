const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = async(req, res) => {
  const userExist = await User.findOne({email: req.body.email});
  if(userExist) return res.status(403).json({ err: "Email has been registered" });
  const user = await new User(req.body)
  await user.save()
  res.status(200).json({ message: 'Signup success. Please login' });
};

exports.signin = async(req, res) => {
  // find the user based on email
  const {email, password} = req.body;
  await User.findOne({ email }, (err, user) => {
    // if no user or error
    if(err || !user) {
      return res.status(401).json({ error: "User with that email does not exist" });
    }
    // if user is found make sure the email and password match
    // create authenticate method
    if(!user.authenticate(password)) {
      return res.status(401).json({ error: "Email and password not match "});
    }    
    // generate a token with user id and secret
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9990 });
    // return response with a user and token to frontend client
    const {_id, name, email} = user
    return res.json({ token, user: {_id, email, name }})
  });
};

exports.signout = async(req, res) => {
  res.clearCookie("t")
  return res.json({ mesage: "Sigout success" })
};

exports.requireSignin = expressJwt({
  // if the token is valid, express jwt appends the verified userId
  // in an auth key to the request object
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});










