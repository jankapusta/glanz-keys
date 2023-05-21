var express = require('express');
const makeDataUrl = require("../functions/makeDataUrl.js");
var router = express.Router();

const OfficeKey = require("../models/OfficeKey.js");
const Transfer = require("../models/Transfer.js");

const renderError = require("../functions/renderError.js");
const getUserName = require("../functions/getUserName.js");

router.get('/key/view', function(req, res, next) {

  OfficeKey.findOne({'_id': req.query.key_id}, (err, officeKey) => {
    if (err) return renderError(res, err, '/admin');

    Transfer.find(
      {key_id: officeKey._id}, 
      'previous_holder next_holder transfer_date key_name', 
      function (err, transfers) {
        if (err) return renderError(res, err, '/admin');
        res.render('key-detail', { 
          pageTitle: 'Glanz Berlin',
          title: 'Key ' + officeKey.key_name + ' details',
          adminUser: getUserName(req),
          transfers: transfers,
          officeKey: officeKey,
          moment: require( 'moment' )
        });
    }).sort('-transfer_date');
  });

});

router.post('/key/update', function(req, res, next) {
  
  OfficeKey.findOne({'_id': req.body.key_id}, (err, officeKey) => {
    if (err || !officeKey) return renderError(res, err || 'Key not found', '/admin');
    officeKey.key_name = req.body.key_name;
    officeKey.short_name = req.body.short_name;
    OfficeKey.updateOne({'_id': officeKey._id}, officeKey, (err) => {
      if (err) return renderError(res, err, '/admin');
      res.render('key-update-done', { 
        pageTitle: 'Glanz Berlin',
        adminUser: getUserName(req),
        title: 'Key updated',
        officeKey: officeKey,
      });
    });
  });
});

router.post('/key/delete', function(req, res, next) {
  
  OfficeKey.findOne({'_id': req.body.key_id}, (err, officeKey) => {
    if (err || !officeKey) return renderError(res, err || 'You have to tick the checkbox');
    OfficeKey.deleteOne({'_id': officeKey._id}, (err) => {
      if (err) return renderError(res, err, '/admin');
      res.render('key-delete-done', { 
        pageTitle: 'Glanz Berlin',
        adminUser: getUserName(req),
        title: 'Key deleted',
        officeKey: officeKey,
      });
    });
  });
});

router.post('/key/add/submit', function(req, res, next) {

  if(!req.body.key_name) {
    return renderError(res, 'Please, enter a key name. ', '/admin/key/add');
  } 

  const officeKeyToSet = {
    current_holder: req.body.holder,
    previous_holder: '-',
    key_name: req.body.key_name,
    short_name: req.body.short_name,
    last_transfer_date: Date.now(),
  };
  // create new one
  newKey = new OfficeKey(officeKeyToSet);
  newKey.save().then(result => {
    console.log(result);
    if(!result._id) return renderError(res, 'Failure', '/admin/key/add');
    makeDataUrl(result, (key) => {
      key.save().then(saveResult => {
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
          res.redirect('/admin/key/add/done?key_id=' + newKey._id);
        });
      });
    });
  });
});

router.get('/key/add/done', function(req, res, next) {

  OfficeKey.findOne({'_id': req.query.key_id}, (err, officeKey) => {
    if (err) return renderError(res, err, '/admin');
    res.render('key-add-done', { 
      pageTitle: 'Glanz Berlin',
      adminUser: getUserName(req),
      title: 'Key added',
      officeKey: officeKey,
    });
  });
});


router.get('/key/add', function(req, res, next) {

  res.render('key-add', { 
    pageTitle: 'Glanz Berlin',
    adminUser: getUserName(req),
    title: 'Add a new key',
  });


});

router.get('/qr/list', function(req, res, next) {

  OfficeKey.find(
    {}, 
    'key_name short_name qr_code', 
    function (err, officeKeys) {
      if (err) return renderError(res, err, '/admin');
      res.render('qr-codes', { 
        title: 'QR codes',
        keys: officeKeys,
      });
    }).sort([['_id', -1]])
});

router.get('/qr/one', function(req, res, next) {
  OfficeKey.findOne({'_id': req.query.key_id}, 'key_name short_name qr_code', (err, officeKey) => {
      if (err) return renderError(res, err, '/admin');
      res.render('qr-codes', {
        title: 'Key: ' + officeKey.key_name,
        keys: [officeKey],
      });
    })
});

router.get('/', function(req, res, next) {

  OfficeKey.find(
    {}, 
    'key_name previous_holder current_holder last_transfer_date qr_code short_name', 
    function (err, officeKeys) {
      if (err) return renderError(res, err, '/admin');
      res.render('key-list', { 
        pageTitle: 'Glanz Berlin',
        adminUser: getUserName(req),
        title: 'Key list',
        keys: officeKeys,
        moment: require( 'moment' )
      });
    }).sort('key_name')
});

module.exports = router;
