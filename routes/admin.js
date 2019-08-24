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
        res.render('key-history', { 
          pageTitle: 'Glanz Berlin',
          transfers: transfers,
          officeKey: officeKey,
          moment: require( 'moment' )
        });
    });
  });

});

router.get('/key/delete', function(req, res, next) {
  
  OfficeKey.findOne({'_id': req.query.key_id}, (err, officeKey) => {
    if (err) return handleError(res, err);

    OfficeKey.deleteOne({'_id': officeKey.id}, (err) => {
      if (err) return handleError(res, err);
      res.render('key-delete-done', { 
        pageTitle: 'Glanz Berlin',
        title: 'Key deleted',
        officeKey: officeKey,
      });
    });
  });

});


router.post('/key/add/submit', function(req, res, next) {

  if(!req.body.key_name) {
    return handleError(res, 'Please, enter a key name. ');
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
    if(!result._id) return handleError(res, 'Failure');

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
      title: 'Key added',
      officeKey: officeKey,
    });
  });
});


router.get('/key/add', function(req, res, next) {

  res.render('key-add', { 
    pageTitle: 'Glanz Berlin',
    title: 'Add new key',
  });


});

router.get('/', function(req, res, next) {

  OfficeKey.find(
    {}, 
    'key_name previous_holder current_holder last_transfer_date', 
    function (err, officeKeys) {
      if (err) return handleError(err);
      res.render('key-list', { 
        pageTitle: 'Glanz Berlin',
        title: 'List of keys',
        keys: officeKeys,
        moment: require( 'moment' )
      });
    })
});

module.exports = router;



const handleError = (res, err) => {

  res.render('error', {
    pageTitle: 'Glanz Berlin',
    error: err,
    back: '/admin'
  });
  res.send();

}