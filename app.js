let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let exhbs = require('express-handlebars')
require('./config/connection');
let session = require('express-session');
let fileUpload = require('express-fileupload')
let nocache = require('nocache');
require('dotenv').config();



let userRouter = require('./routes/user');
let adminRouter = require('./routes/admin');


let app = express();

// view engine setup
let hbs = exhbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutDir: __dirname + "/views/layouts/",
  partialsDir: __dirname + "/views/partials/",
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());
app.use(session({
  key: 'user_sid',
  secret: 'thisisthekeyforuser',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
}));

app.use(nocache())

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


