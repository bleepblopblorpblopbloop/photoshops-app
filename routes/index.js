const express = require("express");
const router = express.Router();

get; /* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
