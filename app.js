import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { engine, create } from 'express-handlebars'
import Handlebars from "handlebars";
import db from './config/connection'
import session from "express-session";
import nocache from 'nocache'
import cors from "cors";
import methodOverride from "method-override";

//user routers
import userRouter from "./routes/user";
import userSettingsRouter from "./routes/users/userSettingRoute";
import productRouter from "./routes/users/productRoute"
import userCouponRouter from "./routes/users/couponRoute";
import userAddressRouter from './routes/users/addressRoute'
import userWishlistRouter from './routes/users/wishlistRoute'

//admin routers
import adminRouter from './routes/admin'
import couponRouter from "./routes/admins/couponRoute";
import cartRouter from "./routes/users/cartRoute";
import adminUserManagement from './routes/admins/userMangeRoute';
import adminAuthRouter from './routes/admins/authentication';
import adminOrderManageRouter from "./routes/admins/orderManageRoute";
import salesReportRouter from './routes/admins/salesReportRoute';
import categoryRouter from './routes/admins/categoryManageRoute'


const app = express();

// view engine setup
let hbs = create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutDir: __dirname + "/views/layouts/",
  partialsDir: __dirname + "/views/partials/",
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);

app.use(cors())
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(nocache())

//Handlebars helper functions
Handlebars.registerHelper('inc', function (value) {
  return value + 1;
})

Handlebars.registerHelper('checkStatus', function (str) {
  if (str === "Active") {
    return 'success'
  }
  else {
    return 'danger'
  }
})

Handlebars.registerHelper("mult", function (input1, input2) {
  let mult = input1 * input2
  return Math.round(mult)
})

Handlebars.registerHelper('paymentStatus', function (str) {
  switch (str) {
    case 'Delivered':
      return 'success'
    case 'placed':
      return 'success'
    case 'Shipped':
      return 'success'
    case 'Returned':
      return 'warning'
    case 'pending':
      return 'warning'
    case 'Cancelled':
      return 'danger'
    case 'cancelled':
      return 'danger'
  }
})

Handlebars.registerHelper('status', function (input) {
  return (input === 'cancelled' || input === 'Cancelled') ? false : (input === 'Delivered' || input === 'Returned') ? false : true;
})

Handlebars.registerHelper('orderStatus', function (input) {
  return (input === 'cancelled' || input === 'Cancelled') ? false : (input === 'pending') ? false : true
})

Handlebars.registerHelper('orderStatusCheck', function (input) {
  return (input === 'Delivered') ? 'Return Order' : (input === 'placed') ? 'Cancel Order' : null
})

//category handlebars helpers
Handlebars.registerHelper('categoryStatus', function (input) {
  return !input ? 'Unlisted' : 'Listed'
})

Handlebars.registerHelper('categoryAttr', function(input){
  return !input ? 'danger' : 'success'
})

Handlebars.registerHelper('count', function(input){
  return input ? input : 0;
})

Handlebars.registerHelper('length', function(input){
  return (input == 0) ? false : true;
})

//coupon helpers
Handlebars.registerHelper('totalAfterDiscount', function(input1, input2){
  return (input1 - input2);
})





app.use(session({
  key: 'user_sid',
  secret: 'thisisthekeyforuser',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
}));

// users router assigning 
app.use('/', userRouter);
app.use('/api/user/Settings', userSettingsRouter);
app.use('/api/user/cart', cartRouter);
app.use('/api/product', productRouter);
app.use('/api/user/coupon', userCouponRouter);
app.use('/api/user/address', userAddressRouter);
app.use('/api/user/wishlist', userWishlistRouter);

//admin router assigning
app.use('/admin', adminRouter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/users', adminUserManagement);
app.use('/api/coupon', couponRouter);
app.use('/api/admin/orders', adminOrderManageRouter)
app.use('/api/admin/salesReport', salesReportRouter);
app.use('/api/admin/category', categoryRouter);


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

module.exports = app



