const express = require("express");
const router = express.Router();
const controller = require("../controllers/profile");

router.get("/", controller.profile.get);

module.exports = router;
