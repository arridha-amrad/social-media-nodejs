const Post = require('../models/post');
const formidable = require('formidable');
// formidable for handling file uploads
const fs = require('fs');
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
  Post.findById(id)
  .populate("postedBy", "_id name")
  // .populate('comments', 'text created')
  .populate('comments.postedBy', '_id name')
  // .populate("postedBy", "_id name role")
  .select("_id title body created likes comments photo")
  .exec((err, post) => {
    if(err || !post) return res.json({ error: err });
    req.post = post;
    next();
  });
}

exports.getPosts = (req, res) => {
  // await Post.find().select("_id title body")
  Post.find()
  .populate("postedBy", "_id name")
  .populate('comments', 'text created')
  .populate('comments.postedBy', '_id name')
  .select("_id title body created likes")
  .sort({created: -1})
  .then(posts => {
    res.json( posts );
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
      post.photo.data = fs.readFileSync(files.photo.path),
      post.photo.contentType = files.photo.type
    }
    post.save((err, result) => {
      if(err) return res.status(400).json({ error: err })
      res.json(result);
    })
  })
};

exports.updatePost = (req, res, next) => {
  // handle the form
  let form = new formidable.IncomingForm()
  form.keepExtensions = true,
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(400).json({ error: "Photo failed to upload" })
    // make changes to user
    let post = req.post
    post = _.extend(post, fields)
    post.updated = Date.now();

    if(files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    // save
    post.save((err, result) => {
      if(err) return res.status(400).json({error: err})
      res.json(post);
    })
  })
}

exports.postByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
  .populate("postedBy", "_id name")
  .select("_id title body created likes")
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

exports.postPhoto = (req, res) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
}

exports.singlePost = (req, res) => {
  return res.json(req.post);
}

exports.like = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId,
    {$push: {likes: req.body.userId}},
    { new:true }
  ).exec((err, result) => {
    if(err) {
      return res.status(400).json({ error: err })
    } else {
      res.json(result);
    }
  });
};

exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId,
    {$pull : {likes: req.body.userId}},
    { new:true }
  ).exec((err, result) => {
    if(err){
      return res.status(400).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: {comments: comment} },
    { new: true }
  )
  .populate("comments.postedBy", "_id name")
  .populate("postedBy", "_id name")
  .exec((err, result) => {
    if(err) {
      return res.status(400).json({error: err})
    } else {
      res.json(result);
    }
  })
}

exports.unComment = (req, res) => {
  let comment = req.body.comment;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: {comments: {_id: comment._id}} },
    { new: true }
  )
  .populate("comments.postedBy", "_id name")
  .populate("postedBy", "_id name")
  .exec((err, result) => {
    if(err) {
      return res.status(400).json({error: err})
    } else {
      res.json(result);
    }
  })
}































