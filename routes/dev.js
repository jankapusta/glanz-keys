var express = require('express');
var router = express.Router();

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


router.get('/images', function(req, res, next) {

  let images = [
    '99d A.png',
    '99d B.png',
    'Arndt.png',
    'Atlantik.png',
    'Cashlife A.png',
    'Cashlife B.png',
    'Cuvry5 A.png',
    'Cuvry5 B.png',
    'Cuvry45 A.png',
    'Cuvry45 B.png',
    'Cuvry45 C.png',
    'F16.png',
    'Huuuge A.png',
    'Huuuge B.png',
    'Huuuge C.png',
    'Huuuge D.png',
    'Inva1.png',
    'Inva2.png',
    'Keith A.png',
    'Keith B.png',
    'Linkstr..png',
    'Mediamath black A.png',
    'Mediamath black B.png',
    'Mediamath black C.png',
    'Mediamath black D.png',
    'Mediamath stairs.png',
    'Mediamath white A.png',
    'Mediamath white B.png',
    'Mediamath white C.png',
    'Mediamath white D.png',
    'Mollstrase C.png',
    'Mollstrasse A.png',
    'Mollstrasse D.png',
    'Mollstrasse E.png',
    'Mollstrasse F.png',
    'Mollstrasse G.png',
    'Mollsttrasse B.png',
    'Peterburgerstr.png',
    'Rheinsberger.png',
    'Riot A.png',
    'Riot B.png',
    'Riot C.png',
    'Riot D.png',
    'Strausberger.png',
    'Vantik A.png',
    'Vantik B.png',
    'Weinsberg.png',
    'Wuhlisch.png',
    ];


    let x = images.map((value, inex) => {
      return {
        'filename': encodeURIComponent(value),
        'short': parseOfficeName(value),
      };

    });

    res.render('qr-codes', {
        images: x
    });


});

module.exports = router;

const parseOfficeName = (filename) => {
  let parts = filename.split('.');
  let fullName = parts[0];
  let extraLength = fullName.length - 15;
  if(extraLength > 0) {
    firstSpaceIndex = fullName.indexOf(' ');
    let shortName = fullName.substr(0, firstSpaceIndex - extraLength - 2) + '.' + fullName.substr(firstSpaceIndex, fullName.length);
    return shortName;
  }
  return fullName;
}

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