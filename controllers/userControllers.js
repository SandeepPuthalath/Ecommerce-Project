const userHelper = require('../helpers/userHelper');
const { response, resource } = require('../app');
const otp_api = require('../middleware/twillioOtpSending');




module.exports = {
    // user login controller to render the login page

    userLogin: (req, res) => {
        res.render('user/login', { 'signupStatus': req.session.signupStatus, "loginErr": req.session.loginErr, 'loginStatus': req.session.loginStatusErr })
        req.session.signupStatus = false;
        req.session.loginErr = false;
        req.session.loginStatusErr = false
    },
    // user login post method to submit the user given cridentials
    // checking if the user have access or not 
    loginPost: (req, res) => {
        userHelper.doLogin(req.body)
            .then((response) => {
                if (response.user.access) {
                    req.session.user = response.user;
                    res.redirect('/');
                }
                else {
                    req.session.loginStatusErr = "This account has been blocked by admin"
                    res.redirect('/login')
                }

            })
            .catch((err) => {
                req.session.loginErr = "Invalid email or password";
                res.redirect('/login');
            })
    },
    // OTP login using twilio api page rendering 
    OtpLogin: (req, res) => {
        res.render('user/otp-login', {
            'otpLoginErr': req.session.otpLoginErr
        })
        req.session.otpLoginErr = false;
    },
    //sending otp if the user given mobile number is registerred with account 

    postOtpLogin: (req, res) => {
        userHelper.checkForUser(req.body.mobile).then((user) => {
            otp_api.send_otp(user.mobile).then((status) => {
                req.session.otpStatus = "OTP sented successfully ";
                req.session.mobile = req.body.mobile;
                res.redirect('/otp-verifying');
            })
        }).catch((err) => {
            req.session.otpLoginErr = "There is no account in the number"
            res.redirect('/otp-login');
        })

    },
    // verfying otp entering page rendering 
    otpVerifying: (req, res) => {
        res.render('user/otp-verifying', {
            'otpStatus': req.session.otpStatus,
            'otpErr': req.session.otpErr
        })
        req.session.otpStatus = false;
        req.session.otpErr = false;
    },
    // veriying for the user and giving access    
    postOtpVerifying: async (req, res) => {
        let mobile = req.session.mobile;
        let enteredOtp = req.body.otp;
        let user = await userHelper.checkForUser(mobile);
        otp_api.verifying_otp(mobile, enteredOtp).then((status) => {
            console.log(status);
            if (status.valid) {
                req.session.user = user;
                res.redirect('/');
            }
            else {
                req.session.otpErr = " OTP does not match"
                res.redirect('/otp-verifying')
            }
        })
    },
    // User signup form is rendered here..
    userSignup: (req, res) => {
        res.render('user/signup', { 'signupErr': req.session.signupErr })
        req.session.signupErr = false
    },

    // submiting the signup form to the server also cheching wheather the user is already signed in with the email address or not
    signupPost: (req, res) => {
        if (req.body.re_password === req.body.password) {
            userHelper.doSignup(req.body).then((data) => {
                req.session.signupStatus = 'Account has been successfully created'
                res.redirect('/login')
            }).catch((err) => {
                req.session.signupErr = "This email address is already registered"
                res.redirect('/signup')
            })
        }
        else {
            req.session.signupErr = 'Password dose not match'
            res.redirect('/signup');
        }

    },
    // Distroing session and letting user loggout of the account 
    userLogout: (req, res) => {
        req.session.user = null;
        req.session.loginStatus = false;
        req.session.loggedOut = "you are successfully logged out"
        res.redirect('/')
    },

    // adding product to cart
    addToCart: (req, res) => {
        let id = req.params.id;
        let userId = req.session.user._id;
        userHelper.addToUserCart(userId, id).then(() => {
            res.json({ status: true })
        })
    },
    //loading user cart 

    loadUserCart: async (req, res) => {
        let user = req.session.user;
        let totalAmount = await userHelper.getTotalAmount(req.session.user._id)
        let product = await userHelper.getUserCart(user._id);

        res.render('user/user-cart', { user, product, totalAmount });

    },
    //controllers for changing cart product quantity
    changeProductQuantity: (req, res, next) => {
        userHelper.changeCartQuantity(req.body).then(async (response) => {
            response.totalAmount = await userHelper.getTotalAmount(req.body.user);
            res.json(response);
        })
    },
    // removing cart product of a user
    userCartProductRemove: (req, res) => {
        userHelper.removeCartProduct(req.body).then((response) => {
            res.json(response);
        })
    },
    placeOrder: async (req, res) => {
        let user = req.session.user;
        let total = await userHelper.getTotalAmount(req.session.user._id);
        res.render('user/place-order', { user, total });
    },
    checkOut: async (req, res) => {

        let products = await userHelper.getCartProductList(req.body.userId);
        let totalAmount = await userHelper.getTotalAmount(req.body.userId)
        userHelper.placingOrder(req.body, products, totalAmount).then((response) => {
            userHelper.removeAllProducts(req.body.userId);
            res.json(response);
        })
    },
    getAccountSettings: async (req, res) => {
        let user = req.session.user;
        let orderDetails = await userHelper.orderDetails(user._id);
        let orderHistory = await userHelper.orderHistory(user._id);
        orderDetails = JSON.parse(JSON.stringify(orderDetails));
        orderHistory = JSON.parse(JSON.stringify(orderHistory));
        res.render('user/user-details', { user, orderDetails, orderHistory });
    },
    orderCancelling: (req, res) => {
        userHelper.removeOrder(req.body.orderId).then((response) =>{
           res.json(response);
        })
    }
}
