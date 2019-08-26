var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.warn(req.headers);
  // console.warn(req.cookies);

  // res.send({
  //   //h: req.headers,
  //   //c: req.cookies,
  //   //u: getUserName()
  // });
  res.send("I am fine");
});

module.exports = router;


// const getUserName = () => {
  
//   const base64AuthData = 'Basic R2xhbno6Y2xlYW5JVA==';
//   if(!base64AuthData) {
//     return '';
//   }
//   const matches = base64AuthData.split('Basic ');
//   let buff = Buffer.from(matches[1], 'base64');  
//   let usernamePwdPair = buff.toString('utf-8');
//   const usernamePwdArray = usernamePwdPair.split(':');
//   return usernamePwdArray[0];
// }
