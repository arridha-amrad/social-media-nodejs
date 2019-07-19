const Post = require('../models/post');
const formidable = require('formidable');
// formidable for handling file uploads
const fs = require('fs');
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
  Post.findById(id)
  .populate("postedBy", "_id name")
  .exec((err, post) => {
    if(err || !post) return res.json({ error: err });
    req.post = post;
    next();
  });
}

exports.getPosts = async (req, res) => {
  // await Post.find().select("_id title body")
  await Post.find().populate("postedBy", "_id name").select("_id title body")
  .then(posts => {
    res.json({ posts });
    //jika key dan value bernilai sama ({ posts: posts }) -> ({ posts })
  })
  .catch(err => console.log(err));
};

exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(400).json({ error: "Image couldn't be uploaded" });
    let post = new Post(fields);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    post.postedBy = req.profile;
    if(files.photo) {
      post.photo.type = fs.readFileSync(files.photo.path),
      post.photo.contentType = files.photo.type
    }
    post.save((err, result) => {
      if(err) return res.status(400).json({ error: err })
      res.json(result);
    })
  })
};

exports.postByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id }).populate("postedBy", "_id name")
  .sort("_created")
  .exec((err, posts) => {
    if(err) return res.status(400).json({ error: err })
    res.json(posts);
  })
}

exports.isPoster = (req, res, next) => {
  let isPoster = 
    req.post && req.auth && req.post.postedBy._id == req.auth._id;
  console.log("req.post", req.post);
  console.log("req.auth", req.auth);
  console.log("req.post.postedBy._id", req.post.postedBy._id);
  console.log("req.auth._id", req.auth._id);

  if(!isPoster) {
    return res.status(403).json({ error: "You are not authorized to perform this action" })
  }
  next();
}

exports.deletePost = (req, res) => {
  let post = req.post
  post.remove((err, result) => {
    if(err) {
      return res.status(400).json({ error: err })
    }
    res.json({ message: `Post has been removed successfully` })
  });
}

exports.updatePost = (req, res) => {
  let post = req.post;
  post = _.extend(post, req.body); //extend -> mutate the source object
  post.created = Date.now();
  post.save(err => {
    if(err) return res.status(400).json({ error: err })
    res.json(post);
  })
}






























