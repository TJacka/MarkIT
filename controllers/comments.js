const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        swipe: req.params.id,
      });
      console.log("Comment added!");
      res.redirect("/swipe/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
};