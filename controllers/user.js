const User = require('../models/user');
const _ = require('lodash');
// package lodash / _ -> untuk update user
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.userById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if(err || !user) {
			return res.status(400).json({ error: "User not found" })
		}
		req.profile = user //has profile object in req with user info
		next();
	});
};

exports.hasAuthorization = (req, res, next) => {
	const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
	if(!authorized) {
		return res.status(403).json({ error: "You are not authorized to perform this action" });
  }
  next();
};

exports.allUsers = (req, res) => {
	User.find((err, users) => {
		// jika terjadi error
		if(err) {
			return res.status(400).json({ error: err });
		}
		res.json(users);
	}).select("name email updated created")
}

exports.getUser = (req, res) => {
	req.profile.salt = undefined;
	req.profile.hashed_password = undefined;
	res.json(req.profile);
};

// exports.updateUser = (req, res) => {
// 	let user = req.profile;
// 	user = _.extend(user, req.body); //extend -> mutate the source object
// 	user.updated = Date.now();
// 	user.save((error) => {
// 		if(error)
// 			return res.status(400).json({ error: "You are not authorized to perform this action" });
// 		req.profile.salt = undefined;
// 		req.profile.hashed_password = undefined;
// 		res.json(user);
// 	})
// };

exports.updateUser = (req, res, next) => {
  // handle the form
  let form = new formidable.IncomingForm()
  form.keepExtensions = true,
  form.parse(req, (error, fields, files) => {
    if(error) return res.status(400).json({ error: "Photo failed to upload" })
    // make changes to user
    let user = req.profile
    user = _.extend(user, fields)
    user.updated = Date.now();
    if(files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }
    // save
    user.save((error, result) => {
      if(error) return res.status(400).json({errror})
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    })
  })
}

exports.deleteUser = (req, res) => {
	let user = req.profile;
	user.remove((error, user) => {
		if(error) return res.status(400).json({ error })
		res.json({ message: `${user.name} has been deleted`});
	})
}












