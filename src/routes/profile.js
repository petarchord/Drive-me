const express = require("express");
const router = express.Router();
const controller = require("../controllers/profile");

router.get("/about", controller.about.get);
router.get("/myprofile", controller.profile.get);
router.post("/myprofile", controller.profile.post);
router.get("/logout", controller.logout.get);

module.exports = router;
