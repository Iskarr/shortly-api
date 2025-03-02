const express = require("express");
const router = express.Router();
const myController = require("../controllers");

router.get("/test", myController.awesomeFunction);
router.post("/shorten", myController.shorten);

module.exports = router;
