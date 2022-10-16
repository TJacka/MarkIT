const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const swipesController = require("../controllers/swipes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes 
router.get("/", homeController.getIndex);
router.get("/home", ensureAuth, authController.getHome);
router.get("/addswipe", ensureAuth, swipesController.addSwipe);
router.get("/allswipes", ensureAuth, swipesController.getSwipes);
router.get("/guestswipes", ensureGuest, swipesController.getFreeSwipes);
router.get("/favswipes", ensureAuth, swipesController.getFavSwipes);
router.get("/myswipes", ensureAuth, swipesController.getUserSwipes);
router.get("/login", authController.getLogin);
router.post("/login", authController.swipeLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.swipeSignup);

module.exports = router;
