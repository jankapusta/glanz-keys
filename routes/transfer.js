var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const OfficeKey = require("../models/OfficeKey.js");

router.get('/done', function(req, res, next) {

  OfficeKey.findOne({'_id': req.query.key_id}, (err, officeKey) => {
    if(err) {
      res.render('error', {
        pageTitle: 'Glanz Berlin',
        error: err
      });
    } else {
      res.render('transfer-done', { 
        pageTitle: 'Glanz Berlin',
        title: 'Key holder updated',
        officeKey: officeKey,
      });
    }
  });
});

router.post('/submit', function(req, res, next) {

  OfficeKey.findOne({'_id': req.body.key_id}, (err, officeKeyToUpdate) => {
    if(err) {
      res.render('error', {
        pageTitle: 'Glanz Berlin',
        error: err
      });
    } else {

      const officeKeyToSet = {
        current_holder: req.body.holder,
        previous_holder: officeKeyToUpdate.current_holder,
        key_name: officeKeyToUpdate.key_name,
        last_transfer_date: Date.now(),
      };
      OfficeKey.updateOne({_id: officeKeyToUpdate._id}, officeKeyToSet).then(success => {
        if(success.ok) {
          res.redirect('/transfer/done?key_id=' + officeKeyToUpdate._id);
        } else {
          res.render('error', {
            pageTitle: 'Glanz Berlin',
            error: 'Failure'
          });
        }
    
      });
    }
  });

  

  // const { body,validationResult } = require('express-validator/check');
  // const { sanitizeBody } = require('express-validator/filter');

  // body('key', 'Choose key').isLength({ min: 1 });
  // body('holder', 'Enter who is taking the key').isLength({ min: 1 });


  //

  // var newKey = new OfficeKey({
  //   key_name: 'Mollstrasse A',
  // });
  // newKey.save(function (err) {
  //   if (err) return handleError(err);
  //   // Bob now has his story
  // });

});


router.get('/', function(req, res, next) {
    
  OfficeKey.find(
    {}, 
    'key_name current_holder', 
    function (err, officeKeys) {
      if (err) return handleError(err);
      // 'athletes' contains the list of athletes that match the criteria.

      res.render('transfer', { 
        pageTitle: 'Glanz Berlin',
        title: 'Transfer key',
        selectedKey: {
          id: 1
        }, 
        keys: officeKeys
      });
    })
  

});

module.exports = router;
