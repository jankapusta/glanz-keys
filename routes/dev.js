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

router.get('/make-images', function(req, res, next) {
  let imagesMap = getImagesMap();

  OfficeKey.find(
    {}, 
    'qr_code key_name short_name', 
    function (err, officeKeys) {
      if (err) {
        console.log(err);
        return;
      }
      officeKeys.forEach((officeKey) => {
        
        let newFilename = 'key_' + officeKey._id + '.png';
        console.log('key ' + officeKey.key_name);
        let oldFilename = imagesMap[officeKey.key_name];
        console.log('newFilename ' + newFilename);
        console.log('oldFilename ' + oldFilename);
        if (!oldFilename) {
          return;
        }
        let shortName = parseOfficeName(oldFilename);
        console.log('shortName ' + shortName);

        officeKey.short_name = shortName;
        officeKey.qr_code = {
          data: fs.readFileSync('./public/images/qr/' + oldFilename),
          content_type: 'image/png',
          filename: newFilename,
        };
        officeKey.save();
        fs.copyFile('./public/images/qr/' + oldFilename, './public/images/qr/' + newFilename, () => {});
      });
    });

    OfficeKey.find(
      {}, 
      'qr_code key_name short_name', 
      function (err, officeKeys) {
      res.render('qr-codes', { 
        title: 'QR codes',
        keys: officeKeys,
      });
    });
})


router.get('/show-images', function(req, res, next) {

  officeKeys = getImages().map((filename) => {
    return {
        'qr_code': {
          'filename': filename,
        },
        'short_name': parseOfficeName(filename),
    }
  })
  res.render('qr-codes', { 
    title: 'QR codes',
    keys: officeKeys,
  });
})


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

const getImagesMap = () => {
  return {
    '99d A': '99 A.png',
    '99d B': '99 B.png',
    'Arndtstr.': 'Ar.png',
    'Atlantic': 'Atl.png',
    'Atlantic gate': 'AtlGt.png',
    'Cashlife A': 'Cash A.png',
    'Cashlife B': 'Cash B.png',
    'Cuvry4+5 A': 'Cvr45 A.png',
    'Cuvry4+5 B': 'Cvr45 B.png',
    'Cuvry4+5 C': 'Cvr45 C.png',
    'Cuvry5 A': 'Cvr5 A.png',
    'Cuvry5 B': 'Cvr5 B.png',
    'Huuuge A': 'Huga A.png',
    'Huuuge B': 'Huga B.png',
    'Huuuge C': 'Huga C.png',
    'Huuuge D': 'Huga D.png',
    'Huuuge E': 'Huga E.png',
    'Inva1': 'Inv1.png',
    'Inva2': 'Inv2.png',
    'Mediamath black A': 'Media black A.png',
    'Mediamath black B': 'Media black B.png',
    'Mediamath black C': 'Media black C.png',
    'Mediamath black D': 'Media black D.png',
    'Mediamath staircase': 'Media stairs.png',
    'Mediamath white A': 'Media white A.png',
    'Mediamath white B': 'Media white B.png',
    'Mediamath white C': 'Media white C.png',
    'Mediamath white D': 'Media white D.png',
    'Mollstrasse B': 'Mollstrasse B.png',
    'Mollstrasse C': 'Mollstrasse C.png',
    'Mollstrasse D': 'Mollstrasse D.png',
    'Mollstrasse E': 'Mollstrasse E.png',
    'Mollstrasse F': 'Mollstrasse F.png',
    'Mollstrasse G': 'Mollstrasse G.png',
    'Peterburgerstr.': 'Peter.png',
    'Riot A': 'Rt A.png',
    'Riot B': 'Rt B.png',
    'Riot C': 'Rt C.png',
    'Riot D': 'Rt D.png',
    'Riot E': '',
    'Riot landlord': '',
    'Riot stairs A': 'RtS A.png',
    'Riot stairs B': 'RtS B.png',
    'Strausberger': 'Straus.png',
    'Vantik A': 'Vn A.png',
    'Vantik B': 'Vn B.png',
    'Weinsberg': 'Wein.png',
    'Wuhlischstr.': 'Whl.png'

  };

}

const getImages = () => {
  return [
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
}
