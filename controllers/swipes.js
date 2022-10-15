const cloudinary = require("../middleware/cloudinary");
const Swipe = require("../models/Swipe");
const User = require("../models/User");
const Comment = require("../models/Comment");
const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  addSwipe: async (req, res) => {
    try {
      const swipes = await Swipe.find({ user: req.user.id });
      res.render("addswipe.ejs", { swipes: swipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const swipes = await Swipe.find().sort({ likes: "desc" }).lean();
      res.render("allswipes.ejs", { swipes: swipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFreeFeed: async (req, res) => {
    try {
      const swipes = await Swipe.find().sort({ likes: "desc" }).lean();
      res.render("guestswipes.ejs", { swipes: swipes });
    } catch (err) {
      console.log(err);
    }
  },
  getFavSwipes: async (req, res) => {
    try {
      const swipes = await Swipe.find( {"fav": true } ).sort({ likes: "desc" }).lean();
      res.render("favswipes.ejs", { swipes: swipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getUserSwipes: async (req, res) => {
    try {
      const swipes = await Swipe.find( { user: req.user.id } ).sort({ likes: "desc" }).lean();
      res.render("myswipes.ejs", { swipes: swipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getSwipe: async (req, res) => {
    try {
      const swipe = await Swipe.findById(req.params.id);
      const comments = await Comment.find({swipe: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("swipe.ejs", { swipe: swipe, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createSwipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Swipe.create({
        fav: false,
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Swipe has been added!");
      res.redirect("/allswipes");
    } catch (err) {
      console.log(err);
    }
  },
  likeSwipe: async (req, res) => {
    try {
      await Swipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/swipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteSwipe: async (req, res) => {
    try {
      // Find swipe by id
      let swipe = await Swipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(swipe.cloudinaryId);
      // Delete swipe from db
      await Swipe.remove({ _id: req.params.id });
      console.log("Deleted Swipe");
      res.redirect("/allswipes");
    } catch (err) {
      res.redirect("/allswipes");
    }
  },
  favSwipe: async (req, res) => {
    try {
      await Swipe.findOneAndUpdate(
        { _id: req.params.id },
        { fav: true }
      );
      console.log("Add to favorites");
      res.redirect(`/swipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
};
