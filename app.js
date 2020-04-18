var createError = require('http-errors');
var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var transferRouter = require('./routes/transfer');
var adminRouter = require('./routes/admin');
var devRouter = require('./routes/dev');
var makeQRFiles = require("./functions/makeQRFiles.js");

var app = express();
const basicAuth = require('express-basic-auth');

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/my_database';
var mongoDB = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/my_database`;
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// make local QR image files from mongo data
makeQRFiles();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dev', devRouter);

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use('/key', basicAuth({
  users: { 
    'glanz': 'glanz',
    'Glanz': 'Glanzberlin19!', 
  },
  challenge: true,
  realm: 'glanzberlinweb',
}), transferRouter);

app.use('/admin', basicAuth({
  users: { 
    'Glanz': 'Glanzberlin19!',  
  },
  challenge: true,
  realm: 'glanzberlinweb',
}), adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
