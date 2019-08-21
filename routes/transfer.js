var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('transfer', { 
    pageTitle: 'Glanz Berlin',
    title: 'Transfer key',
    selectedKey: {
      id: 1
    }, 
    keys: [
      {
        id: 1, 
        title: 'Mollstrasse',  
      },
      {
        id: 2, 
        title: 'Cuvry',  
      }
    ]
  });
});

module.exports = router;
