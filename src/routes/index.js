const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.get("/", controller.index.get);
router.get("/about", controller.about.get);
router.get("/register", controller.register.get);
router.get("/adddrive", controller.adddrive.get);
router.get("/editdrive/:id", controller.editdrive.get);
router.get("/deletedrive/:id", controller.deletedrive.get);
router.get("/logout", controller.logout.get);

module.exports = router;
