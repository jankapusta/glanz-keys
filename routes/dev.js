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
    'Ar.png',
'Atl.png',
'AtlGt.png',
'99 A.png',
'99 B.png',
'Cash A.png',
'Cash B.png',
'Cvr5 A.png',
'Cvr5 B.png',
'Cvr45 A.png',
'Cvr45 B.png',
'Cvr45 C.png',
'F16.png',
'Huga A.png',
'Huga B.png',
'Huga C.png',
'Huga D.png',
'Huga E.png',
'Inv1.png',
'Inv2.png',
'K A.png',
'K B.png',
'Lnk.png',
'Media black A.png',
'Media black B.png',
'Media black C.png',
'Media black D.png',
'Media stairs.png',
'Media white A.png',
'Media white B.png',
'Media white C.png',
'Media white D.png',
'Mollstrasse A.png',
'Mollstrasse B.png',
'Mollstrasse C.png',
'Mollstrasse D.png',
'Mollstrasse E.png',
'Mollstrasse F.png',
'Mollstrasse G.png',
'Peter.png',
'Rhn.png',
'Rt A.png',
'Rt B.png',
'Rt C.png',
'Rt D.png',
'RtS A.png',
'RtS B.png',
'Straus.png',
'Vn A.png',
'Vn B.png',
'Wein.png',
'Whl.png'
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
