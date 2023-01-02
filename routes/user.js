var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/user-controllers')
const page_controller = require('../controllers/page-controller');
const { doLogout } = require('../helpers/user-helper');
const session_check = require('../middleware/session-handling');




/* GET home page. */
router.get('/', page_controller.loadLandingPage);
// login page rendering and submitting...

router.route('/login').get(session_check.authenticationCheck,user_controller.userLogin).post(user_controller.loginPost);

// OTP login using mobile number..
router.route('/otp-login').get(session_check.authenticationCheck,user_controller.OtpLogin).post(user_controller.postOtpLogin);

// sending OTP to registered mobile number...

router.route('/otp-verifying').get(session_check.authenticationCheck, user_controller.otpVerifying).post(user_controller.postOtpVerifying)

// signup page rendering and submitting...
router.route('/signup').get(session_check.authenticationCheck,user_controller.userSignup).post(user_controller.signupPost)

//logging out from the user ...

router.get('/logout',user_controller.userLogout);

//product listing in user side..
router.get('/product-view',page_controller.productListing)

//viewing product details....

router.get('/product/:id', page_controller.productView);

//Image zoom rendering page 

router.get('/user/image-zoom/:id',page_controller.getImageZoomPage);


module.exports = router;
