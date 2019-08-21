var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('admin', { 
    pageTitle: 'Glanz Berlin',
    title: 'List of keys',
    keys: [
      {
        id: 1, 
        location: 'Mollstrasse',  
        holder: 'Majka'
      },
      {
        id: 2, 
        location: 'Cuvry',  
        holder: 'Katka'
      }
    ]
  });
});

module.exports = router;
