const Post = require('../models/post');

exports.getPosts = async (req, res) => {
  // await Post.find().select("_id title body")
  await Post.find().select("-__v")
  .then(posts => {
    res.json({ posts });
    //jika key dan value bernilai sama ({ posts: posts }) -> ({ posts })
  })
  .catch(err => console.log(err));
};

exports.createPost = (req, res) => {
  const post = new Post(req.body);
  post.save().then(result => {
    res.json({ post: result });
  });
};