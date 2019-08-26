var express = require('express');
var router = express.Router();

const OfficeKey = require("../models/OfficeKey.js");
const Transfer = require("../models/Transfer.js");

const renderError = require("../functions/renderError.js");
const getUserName = require("../functions/getUserName.js");

router.get('/done', function(req, res, next) {

  OfficeKey.findOne({'_id': req.query.key_id}, (err, officeKey) => {
    if (err) return renderError(res, err);
    res.render('transfer-done', { 
      pageTitle: 'Glanz Berlin',
      title: 'Key holder updated',
      officeKey: officeKey,
    });
  });
});

router.post('/submit', function(req, res, next) {

  if(!req.body.key_id || !req.body.holder) {
    return renderError(res, 'Please, choose key and enter the name. ');
  } 

  OfficeKey.findOne({'_id': req.body.key_id}, (err, officeKeyToUpdate) => {
      if (err) return renderError(res, err);

      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      const historyRecord = {
        next_holder: req.body.holder,
        previous_holder: officeKeyToUpdate.current_holder,
        transfer_date: Date.now(),
        key_name: officeKeyToUpdate.key_name,
        key_id: officeKeyToUpdate._id,
        ip_address: ip,
      };
      const officeKeyToSet = {
        current_holder: historyRecord.next_holder,
        previous_holder: historyRecord.previous_holder,
        key_name: historyRecord.key_name,
        last_transfer_date: historyRecord.transfer_date,
      };

      //set user name to cookie
      res.cookie('keyHolderName', officeKeyToSet.current_holder);
      // track history
      Transfer.create(historyRecord).then(result => {
        if(!result.ok) {
          console.log('failed to save transfer track record');
        }
      });

      // update current one
      OfficeKey.updateOne({_id: officeKeyToUpdate._id}, officeKeyToSet).then(result => {
        if(!result.ok) return renderError(res, 'Failure');
        res.redirect('/key/done?key_id=' + officeKeyToUpdate._id);
      });


  });

});


router.get('/', function(req, res, next) {
  
  const rednerTransfer = (req, officeKeys, selectedKey = false) => {
    res.render('transfer', { 
      pageTitle: 'Glanz Berlin',
      title: 'Transfer key',
      selectedKey: selectedKey, 
      holderName: req.cookies.keyHolderName || '',
      keys: officeKeys,
      adminUser: getUserName(req)
    });
  }
  
  OfficeKey.find(
    {}, 
    'key_name current_holder', 
    function (err, officeKeys) {
      if (err) return renderError(res, err);

      if(req.query.key_id) {
        OfficeKey.findOne({'_id': req.query.key_id}, (err, officeKey) => {
          if (err) return renderError(res, err);
          rednerTransfer(req, officeKeys, officeKey);
        });
      } else {
        rednerTransfer(req, officeKeys);
      }
    })
  

});

module.exports = router;
