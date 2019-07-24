const User = require('../models/user');
const _ = require('lodash');
// package lodash / _ -> untuk update user
const formidable = require('formidable');
const fs = require('fs');

exports.userById = (req, res, next, id) => {
  User.findById(id)
      // populate followers and following users array
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec((err, user) => {
          if (err || !user) {
              return res.status(400).json({
                  error: err
              });
          }
          req.profile = user; // adds profile object in req with user info
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
	User.find((error, users) => {
		// jika terjadi error
		if(error) {
			return res.status(400).json({ oror: error });
		}
		res.json(users);
	}).select("name email updated created")
}

exports.getUser = (req, res) => {
	req.profile.salt = undefined;
	req.profile.hashed_password = undefined;
	res.json(req.profile);
};

exports.updateUser = (req, res) => {
  // handle the form
  let form = new formidable.IncomingForm()
  form.keepExtensions = true,
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(400).json({ error: "Photo failed to upload" })
    // make changes to user
    let user = req.profile
    user = _.extend(user, fields)
    user.updated = Date.now();
    if(files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }
    // save
    user.save((err, result) => {
      if(err) return res.status(400).json({error: err})
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    })
  })
}

exports.deleteUser = (req, res) => {
	let user = req.profile;
	user.remove((err, user) => {
		if(err) return res.status(400).json({ error: err })
		res.json({ message: `${user.name} has been deleted`});
	})
}

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
};

// follow unfollow
exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
      req.body.userId,
      { $push: { following: req.body.followId } },
      (err, result) => {
          if (err) {
              return res.status(400).json({ error: err });
          }
          next();
      }
  );
};

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId } },
      { new: true }
  )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec((err, result) => {
          if (err) {
              return res.status(400).json({
                  error: err
              });
          }
          result.hashed_password = undefined;
          result.salt = undefined;
          res.json(result);
      });
};

// follow unfollow
exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
      req.body.userId,
      { $pull: { following: req.body.unfollowId } },
      (err, result) => {
          if (err) {
              return res.status(400).json({ error: err });
          }
          next();
      }
  );
};

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.body.userId } },
      { new: true }
  )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec((err, result) => {
          if (err) {
              return res.status(400).json({
                  error: err
              });
          }
          result.hashed_password = undefined;
          result.salt = undefined;
          res.json(result);
      });
};

// find people
exports.findPeople = (req, res) => {
  // 1. user yg sudah difollow tidak akan tampil
  let following = req.profile.following;
  // 2. termasuk sipemilik account
  following.push(req.profile._id)
  // 3. cari user yg memenuhi syarat diatas
  // 4. user dicari berdasar ID, kecuali user2 yang masuk dalam variable following. $nin->not include
  User.find({_id : {$nin: following}}, 
    (err, users) => {
      if(err) {
        return res.status(400).json({error: err})
      }
      res.json(users);
      // 5 tapi, cukur data nama users saja
    }).select("name")
}












