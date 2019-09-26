const express = require("express");
const router = express.Router();
const controller = require("../controllers/searchresult");

router.get("/searchresult/:id", controller.search.get);
router.post("/searchresult", controller.search.post);

module.exports = router;
