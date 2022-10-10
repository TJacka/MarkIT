const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  addSwipe: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("addswipe.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ likes: "desc" }).lean();
      res.render("topswipes.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFreeFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ likes: "desc" }).lean();
      res.render("guestswipes.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getFavSwipes: async (req, res) => {
    try {
      const posts = await Post.find().sort({ likes: "desc" }).lean();
      res.render("favswipes.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getUserSwipes: async (req, res) => {
    try {
      const posts = await Post.find().sort({ likes: "desc" }).lean();
      res.render("myswipes.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("swipe.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/feed");
    } catch (err) {
      res.redirect("/feed");
    }
  },
};
