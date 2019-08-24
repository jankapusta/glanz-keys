var express = require('express');
var router = express.Router();

const OfficeKey = require("../models/OfficeKey.js");

router.get('/key/view', function(req, res, next) {


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

router.get('/key/add', function(req, res, next) {


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
