
module.exports =  (res, err, backLink = '') => {

  res.render('error', {
    pageTitle: 'Glanz Berlin',
    error: err,
    back: backLink || '/transfer',
  });
  res.send();

}

