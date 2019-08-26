var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.headers);
  console.log(req.cookies);
  res.send("I am fine");
});

module.exports = router;
