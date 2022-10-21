const cloudinary = require("../middleware/cloudinary");
const Swipe = require("../models/Swipe");
const User = require("../models/User");
const Comment = require("../models/Comment");

module.exports = {
  addSwipe: async (req, res) => {
    try {
      const swipes = await Swipe.find({ user: req.user.id });
      res.render("addswipe.ejs", { swipes: swipes, user: req.user });
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
  getFreeSwipes: async (req, res) => {
    try {
      const swipes = await Swipe.find().sort({ likes: "desc" }).lean();
      res.render("guestswipes.ejs", { swipes: swipes });
    } catch (err) {
      console.log(err);
    }
  },
  getFavSwipes: async (req, res) => {
    try {
      const swipes = await Swipe.find().sort({ likes: "desc" }).lean();
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
  getSwipes: async (req, res) => {
    try {
      const swipes = await Swipe.find().sort({ likes: "desc" }).lean();
      res.render("allswipes.ejs", { swipes: swipes, user: req.user });
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
        userName: req.user.userName
      });
      console.log("Swipe has been added!");
      if (req.user.swipes > 0) {
        res.redirect("/allswipes");
      } else {
        res.redirect("/addswipe");
      }
    } catch (err) {
      console.log(err);
    }
  },
  likeSwipe: async (req, res)=>{
    let liked = false
    try{
      let swipe = await Swipe.findById({_id:req.params.id})
      liked = (swipe.likes.includes(req.user.id))
    } catch(err){
    }
    //if already liked we will remove user from likes array
    if(liked){
      try{
        await Swipe.findOneAndUpdate({_id:req.params.id},
          {
            $pull : {'likes' : req.user.id}
          })
          console.log('Removed user from likes array')
          res.redirect('back')
        }catch(err){
          console.log(err)
        }
      }
      //else add user to like array
      else{
        try{
          await Swipe.findOneAndUpdate({_id:req.params.id},
            {
              $addToSet : {'likes' : req.user.id}
            })
            console.log('Added user to likes array')
            res.redirect(`back`)
        }catch(err){
            console.log(err)
        }
      }
    },
  favSwipe: async (req, res)=>{
    let favorited = false
    try{
      let swipe = await Swipe.findById({_id:req.params.id})
      favorited = (swipe.favorites.includes(req.user.id))
    } catch(err){
    }
    //if already favorited we will remove user from array
    if(favorited){
      try{
        await Swipe.findOneAndUpdate({_id:req.params.id},
          {
            $pull : {'favorites' : req.user.id}
          })
          console.log('Removed user from favorites array')
          res.redirect('back')
        }catch(err){
          console.log(err)
        }
      }
      //else add user to favorites array
      else{
        try{
          await Swipe.findOneAndUpdate({_id:req.params.id},
            {
              $addToSet : {'favorites' : req.user.id}
            })
            console.log('Added user to favorites array')
            res.redirect(`back`)
        }catch(err){
            console.log(err)
        }
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
        res.redirect("/myswipes");
      } catch (err) {
        res.redirect("/allswipes");
      }
    },
};
