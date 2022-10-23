const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const swipesController = require("../controllers/swipes");
const { ensureAuth } = require("../middleware/auth");

//Swipe Routes
router.get("/:id", ensureAuth, swipesController.getSwipe);

router.post("/createSwipe", upload.single("file"), swipesController.createSwipe);

router.put("/likeSwipe/:id", swipesController.likeSwipe);

router.put("/favSwipe/:id", swipesController.favSwipe);

router.delete("/deleteSwipe/:id", swipesController.deleteSwipe);

module.exports = router;
