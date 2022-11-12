var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send({
    statusCode: 200,
    message: "Express-Index",
  });
});

module.exports = router;
