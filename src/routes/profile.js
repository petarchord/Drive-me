const express = require("express");
const router = express.Router();
const Controller = require("../controllers/profile");

router.get("/myprofile", Controller.profile.get);
router.post("/myprofile", Controller.profile.post);

module.exports = router;
