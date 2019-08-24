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
        holder: 'Majka',
        date: '2019-08-19'
      },
      {
        id: 2, 
        location: 'Cuvry key A',  
        holder: 'Katka',
        date: '2019-08-19'
      },
      {
        id: 2, 
        location: 'Cuvry key B',  
        holder: 'Anna',
        date: '2019-08-20'
      }
    ]
  });
});

module.exports = router;
