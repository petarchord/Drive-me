const express = require("express");
const router = express.Router();
const controller = require("../controllers/drives");

router.get("/mydrives", controller.drives.get);
router.post("/mydrives", controller.drives.post);

module.exports = router;
