var express = require('express');
var router = express.Router();
const OfficeKey = require("../models/OfficeKey.js");
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.warn(req.headers);
  console.warn(req.cookies);

  res.send({
    h: req.headers,
    c: req.cookies,
    //u: getUserName()
    u:getUserName(req)
  });
  //res.send("I am fine");
});

module.exports = router;

const getUserName = (req) => {
  
  const base64AuthData = req.headers['authorization'] || req.headers['Authorization'];
  if(!base64AuthData) {
    return '';
  }
  const matches = base64AuthData.split('Basic ');
  let buff = Buffer.from(matches[1], 'base64');  
  let usernamePwdPair = buff.toString('utf-8');
  const usernamePwdArray = usernamePwdPair.split(':');
  return usernamePwdArray[0];
  
}


