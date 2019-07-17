const Post = require('../models/post');

exports.getPosts = (req, res) => {
  res.json({ 
    posts: [{ title: "First Post" }, { title: "Second Post" }] 
  });
};

exports.createPost = (req, res) => {
  const post = new Post(req.body);
  // console.log("Creating post: ", post);
  post.save((err, result) => {
    if(err) {
      return res.status(404).json({ msg: err.message })
    }
    res.status(200).json({ post: result })
  });
};