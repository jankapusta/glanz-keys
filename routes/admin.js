var express = require('express');
var router = express.Router();

const OfficeKey = require("../models/OfficeKey.js");
const Transfer = require("../models/Transfer.js");


router.get('/key/view', function(req, res, next) {

  OfficeKey.findOne({'_id': req.query.key_id}, (err, officeKey) => {
    if (err) return handleError(res, err);

    Transfer.find(
      {key_id: officeKey._id}, 
      'previous_holder next_holder transfer_date', 
      function (err, transfers) {
        if (err) return handleError(err);
        res.render('key-detail', { 
          pageTitle: 'Glanz Berlin',
          adminUser: req.cookies.adminName,
          transfers: transfers,
          officeKey: officeKey,
          moment: require( 'moment' )
        });
    }).sort('-transfer_date');
  });

});

router.post('/key/update', function(req, res, next) {
  
  OfficeKey.findOne({'_id': req.body.key_id}, (err, officeKey) => {
    if (err || !officeKey) return handleError(res, err || 'Key not found');
    officeKey.key_name = req.body.key_name;
    OfficeKey.updateOne({'_id': officeKey._id}, officeKey, (err) => {
      if (err) return handleError(res, err);
      res.render('key-update-done', { 
        pageTitle: 'Glanz Berlin',
        adminUser: req.cookies.adminName,
        title: 'Key renamed',
        officeKey: officeKey,
      });
    });
  });
});

router.post('/key/delete', function(req, res, next) {
  
  OfficeKey.findOne({'_id': req.body.key_id}, (err, officeKey) => {
    if (err || !officeKey) return handleError(res, err || 'You have to tick the checkbox');
    OfficeKey.deleteOne({'_id': officeKey._id}, (err) => {
      if (err) return handleError(res, err);
      res.render('key-delete-done', { 
        pageTitle: 'Glanz Berlin',
        adminUser: req.cookies.adminName,
        title: 'Key deleted',
        officeKey: officeKey,
      });
    });
  });
});

router.post('/key/add/submit', function(req, res, next) {

  if(!req.body.key_name) {
    return handleError(res, 'Please, enter a key name. ', '/admin/key/add');
  } 

  const officeKeyToSet = {
    current_holder: req.body.holder,
    previous_holder: '-',
    key_name: req.body.key_name,
    last_transfer_date: Date.now(),
  };
  // create new one
  newKey = new OfficeKey(officeKeyToSet);
  newKey.save().then(result => {
    console.log(result);
    if(!result._id) return handleError(res, 'Failure', '/admin/key/add');

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const historyRecord = {
      next_holder: officeKeyToSet.current_holder,
      previous_holder: '- created -',
      transfer_date: officeKeyToSet.last_transfer_date,
      key_name: officeKeyToSet.key_name,
      key_id: newKey._id,
      ip_address: ip,
    };
    // track history
    Transfer.create(historyRecord).then(result => {
      if(!result.ok) {
        console.log('failed to save transfer track record');
      }
    });

    res.redirect('/admin/key/add/done?key_id=' + newKey._id);
  });
});

router.get('/key/add/done', function(req, res, next) {

  OfficeKey.findOne({'_id': req.query.key_id}, (err, officeKey) => {
    if (err) return handleError(res, err);
    res.render('key-add-done', { 
      pageTitle: 'Glanz Berlin',
      adminUser: req.cookies.adminName,
      title: 'Key added',
      officeKey: officeKey,
    });
  });
});


router.get('/key/add', function(req, res, next) {

  res.render('key-add', { 
    pageTitle: 'Glanz Berlin',
    adminUser: req.cookies.adminName,
    title: 'Add new key',
  });


});

router.get('/', function(req, res, next) {

  
  res.cookie('adminName', getUserName(req) || '');
  OfficeKey.find(
    {}, 
    'key_name previous_holder current_holder last_transfer_date', 
    function (err, officeKeys) {
      if (err) return handleError(err);
      res.render('key-list', { 
        pageTitle: 'Glanz Berlin',
        adminUser: req.cookies.adminName,
        title: 'List of keys',
        keys: officeKeys,
        moment: require( 'moment' )
      });
    }).sort('key_name')
});

module.exports = router;


const getUserName = (req) => {
  
  const base64AuthData = req.headers['Authorization'];
  if(!base64AuthData) {
    return '';
  }
  const matches = base64AuthData.split('Basic ');
  let buff = Buffer.from(matches[1], 'base64');  
  let usernamePwdPair = buff.toString('utf-8');
  const usernamePwdArray = usernamePwdPair.split(':');
  return usernamePwdArray[0];
  
}

const handleError = (res, err, backLink = '') => {

  res.render('error', {
    pageTitle: 'Glanz Berlin',
    error: err,
    back: backLink || '/admin'
  });
  res.send();

}