const mongoose = require("mongoose");

const SwipeSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
  },
  likes: {
    type: Array,
    required: true,
  },
  favorites: {
    type: Array,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
  },
});

module.exports = mongoose.model("Swipe", SwipeSchema);
