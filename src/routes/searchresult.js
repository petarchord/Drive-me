const express = require("express");
const router = express.Router();
const controller = require("../controllers/searchresult");

router.get("/:id", controller.search.get);
router.post("/", controller.search.post);

module.exports = router;
