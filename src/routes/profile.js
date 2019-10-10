const express = require("express");
const router = express.Router();
const controller = require("../controllers/profile");

router.get("/", controller.profile.get);
router.post("/", controller.profile.post);

module.exports = router;
