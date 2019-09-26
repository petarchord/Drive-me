const express = require("express");
const router = express.Router();
const controller = require("../controllers/drives");

router.get("/mydrives", controller.drives.get);
router.post("/mydrives", controller.drives.post);
router.get("/adddrive", controller.adddrive.get);
router.get("/editdrive/:id", controller.editdrive.get);
router.get("/deletedrive/:id", controller.deletedrive.get);

module.exports = router;
