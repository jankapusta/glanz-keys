
module.exports =  (res, err, backLink = '') => {

  res.render('error', {
    pageTitle: 'Glanz Berlin',
    title: 'Error',
    error: err,
    back: backLink || '/key',
  });
  res.send();

}

