const express = require("express");
const router = express.Router();
const controller = require("../controllers/drives");

router.get("/", controller.drives.get);
router.post("/", controller.drives.post);

module.exports = router;
