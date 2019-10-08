const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.get("/", controller.index.get);
router.get("/about", controller.about.get);
router.get("/register", controller.register.get);

module.exports = router;
