var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.warn(req.headers);
  console.warn(req.cookies);
  res.send({
    h: req.headers,
    c: req.cookies
  });
  //res.send("I am fine");
});

module.exports = router;
