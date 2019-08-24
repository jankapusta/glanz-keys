var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const OfficeKey = require("../models/OfficeKey.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  

  // find all athletes who play tennis, selecting the 'name' and 'age' fields
  OfficeKey.find(
    {}, 
    'key_name previous_holder current_holder last_transfer_date', 
    function (err, officeKeys) {
      if (err) return handleError(err);
      // 'athletes' contains the list of athletes that match the criteria.

      res.render('admin', { 
        pageTitle: 'Glanz Berlin',
        title: 'List of keys',
        keys: officeKeys,
        moment: require( 'moment' )
      });
    })
});

module.exports = router;
