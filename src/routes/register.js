const express = require("express");
const router = express.Router();
const controller = require("../controllers/register");

router.get("/register", controller.register.get);

module.exports = router;
