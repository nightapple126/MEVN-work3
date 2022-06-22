var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var show = require('./src/utils/show');
var index = require('./src/routes/index');
var passportMiddleware = require('./src/middlewares/passport-base');
var securityMiddleware = require('./src/middlewares/security');
var cors = require('cors');
var db = require('./src/models/db');
var app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.disable('etag');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use('/', passportMiddleware);
require('./src/middlewares/authentication');
app.use('/', securityMiddleware);






const autoloader = require('./src/utils/Autoloader');


app.use('/',autoloader);

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
