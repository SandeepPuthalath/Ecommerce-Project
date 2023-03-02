const userHelper = require("../helpers/userHelper");
const userSchema = require("../model/userModel");
const otp_api = require("../middleware/twillioOtpSending");
const addressSchema = require("../model/addressModel");
const productSchema = require("../model/productModel");
const wishlistSchema = require("../model/wishlistModel");
const { getUserWishlist } = require("../helpers/userHelper");
const objectId = require("mongodb").ObjectId;
const paypal = require("paypal-rest-sdk");
const api = require("../api/razorpay");
const { response } = require("../app");

const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;

paypal.configure({
  mode: "sandbox", // or 'live'
  client_id: `${client_id}`,
  client_secret: `${client_secret}`,
});

module.exports = {
  // user login controller to render the login page

  userLogin: (req, res) => {
    try {
      res.render("user/login", {
        user_header: true,
        signupStatus: req.session.signupStatus,
        loginErr: req.session.loginErr,
        loginStatus: req.session.loginStatusErr,
      });
      req.session.signupStatus = false;
      req.session.loginErr = false;
      req.session.loginStatusErr = false;
    } catch (err) {
      res.status(500);
    }
  },
  // user login post method to submit the user given cridentials
  // checking if the user have access or not
  loginPost: (req, res) => {
    try {
      userHelper
        .doLogin(req.body)
        .then((response) => {
          if (response.user.access) {
            req.session.user = response.user;
            res.redirect("/");
          } else {
            req.session.loginStatusErr =
              "This account has been blocked by admin";
            res.redirect("/login");
          }
        })
        .catch((err) => {
          req.session.loginErr = "Invalid email or password";
          res.redirect("/login");
        });
    } catch (err) {
      res.status(500);
    }
  },
  // OTP login using twilio api page rendering
  OtpLogin: (req, res) => {
    res.render("user/otp-login", {
      otpLoginErr: req.session.otpLoginErr,
      user_header: true,
    });
    req.session.otpLoginErr = false;
  },
  //sending otp if the user given mobile number is registerred with account

  postOtpLogin: (req, res) => {
    userHelper
      .checkForUser(req.body.mobile)
      .then((user) => {
        otp_api.send_otp(user.mobile).then((status) => {
          req.session.otpStatus = "OTP sented successfully ";
          req.session.mobile = req.body.mobile;
          res.redirect("/otp-verifying");
        });
      })
      .catch((err) => {
        req.session.otpLoginErr = "There is no account in the number";
        res.redirect("/otp-login");
      });
  },
  // verfying otp entering page rendering
  otpVerifying: (req, res) => {
    res.render("user/otp-verifying", {
      otpStatus: req.session.otpStatus,
      otpErr: req.session.otpErr,
    });
    req.session.otpStatus = false;
    req.session.otpErr = false;
  },
  // veriying for the user and giving access
  postOtpVerifying: async (req, res) => {
    let mobile = req.session.mobile;
    let enteredOtp = req.body.otp;
    let user = await userHelper.checkForUser(mobile);
    otp_api.verifying_otp(mobile, enteredOtp).then((status) => {
      if (status.valid) {
        req.session.user = user;
        res.redirect("/");
      } else {
        req.session.otpErr = " OTP does not match";
        res.redirect("/otp-verifying");
      }
    });
  },
  // User signup form is rendered here..
  userSignup: (req, res) => {
    res.render("user/signup", {
      user_header: true,
      signupErr: req.session.signupErr,
    });
    req.session.signupErr = false;
  },

  // submiting the signup form to the server also cheching wheather the user is already signed in with the email address or not
  signupPost: (req, res) => {
    if (req.body.re_password === req.body.password) {
      userHelper
        .doSignup(req.body)
        .then((data) => {
          req.session.signupStatus = "Account has been successfully created";
          res.json(true);
        })
        .catch(() => {
          req.session.signupErr = "This email address is already registered";
          res.json(false);
        });
    } else {
      req.session.signupErr = "Password dose not match";
      res.redirect("/signup");
    }
  },
  // Distroing session and letting user loggout of the account
  userLogout: (req, res) => {
    req.session.user = null;
    req.session.loginStatus = false;
    req.session.loggedOut = "you are successfully logged out";
    res.redirect("/");
  },

  // adding product to cart
  addToCart: (req, res) => {
    try {
      let user = req.session.user;
      let id = req.params.id;
      let userId = user._id;
      if (user) {
        userHelper.addToUserCart(userId, id).then(() => {
          res.json({ status: true });
        });
      } else {
        res.json({ status: false });
      }
    } catch (err) {
      res.status(500);
    }
  },

  //adding items from wishlist to cart..

  addFromWishlist: (req, res) => {
    try {
      let prodId = req.params.prodId;
      let userId = req.session.user._id;

      userHelper.wishlistToCart(prodId, userId).then((response) => {
        res.json(response);
      });
    } catch (err) {
      res.status(500);
    }
  },
  //loading user cart

  loadUserCart: async (req, res) => {
    let user = req.session.user;
    let totalAmount = await userHelper.getTotalAmount(req.session.user._id);
    let product = await userHelper.getUserCart(user._id);
    if (totalAmount == 0) {
      res.render("user/user-cart", { user, cartIsEmpty: true });
    } else {
      res.render("user/user-cart", {
        user,
        product,
        totalAmount,
        cartIsEmpty: false,
      });
    }
  },
  //controllers for changing cart product quantity
  changeProductQuantity: async (req, res, next) => {
    try {
      userHelper.changeCartQuantity(req.body).then(async (response) => {
        response.totalAmount = await userHelper.getTotalAmount(req.body.user);
        res.json(response);
      });
    } catch {
      res.status(500);
    }
  },
  // removing cart product of a user
  userCartProductRemove: (req, res) => {
    userHelper.removeCartProduct(req.body).then((response) => {
      res.json(response);
    });
  },
  placeOrder: async (req, res) => {
    let user = req.session.user;
    try {
      let total = await userHelper.getTotalAmount(req.session.user._id);
      let userAddress = await addressSchema.find({
        userId: objectId(user._id),
      });
      let products = await userHelper.getUserCart(user._id);
      console.log(products);
      products = JSON.parse(JSON.stringify(products));
      userAddress = JSON.parse(JSON.stringify(userAddress));
      res.render("user/place-order", { user, total, userAddress, products });
    } catch (err) {
      res.status(500);
    }
  },

  checkOut: async (req, res) => {
    try {
      let products = await userHelper.getCartProductList(req.body.userId);
      let totalAmount = await userHelper.getTotalAmount(req.body.userId);
      userHelper
        .placingOrder(req.body, products, totalAmount)
        .then((orderDetails) => {
          userHelper.removeAllProducts(req.body.userId);
          if (req.body["payment_option"] == "cod") {
            let redirect_urls = "/user/user-cart";
            res.json({ success: "cod", redirect_urls });
          } else if (req.body["payment_option"] == "paypal") {
            const create_payment_json = {
              intent: "sale",
              payer: {
                payment_method: "paypal",
              },
              redirect_urls: {
                return_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel",
              },
              transactions: [
                {
                  item_list: {
                    items: [
                      {
                        name: `${req.body.userId}`,
                        sku: "001",
                        price: `${totalAmount}`,
                        currency: "INR",
                        quantity: 1,
                      },
                    ],
                  },
                  amount: {
                    currency: "INR",
                    total: `${req.body.userId}`,
                  },
                  description: "Hat for the best team ever",
                },
              ],
            };
            paypal.payment.create(
              create_payment_json,
              function (error, payment) {
                if (error) {
                  throw error;
                } else {
                  console.log("create payment resopone");
                  payment = payment.links.filter(
                    (data) => data.rel == "approval_url"
                  )[0];
                  redirect_urls = payment.href;
                  res.json({ success: "paypal", redirect_urls });
                }
              }
            );
          } else if (req.body["payment_option"] == "razorpay") {
            api.processRazorpay(orderDetails._id, totalAmount).then((order) => {
              res.json({ success: "razorpay", order, orderDetails });
            });
          }
        });
    } catch (err) {
      res.status(500);
    }
  },
  getAccountSettings: async (req, res) => {
    let user = req.session.user;
    let orderDetails = await userHelper.orderDetails(user._id);
    let orderHistory = await userHelper.orderHistory(user._id);
    orderDetails = JSON.parse(JSON.stringify(orderDetails));
    orderHistory = JSON.parse(JSON.stringify(orderHistory));
    console.log(orderDetails);
    res.render("user/user-details", { user, orderDetails, orderHistory });
  },
  orderCancelling: (req, res) => {
    try {
      userHelper.removeOrder(req.body.orderId).then((response) => {
        res.json(response);
      });
    } catch (err) {
      res.status(500);
    }
  },
  addAddress: (req, res) => {
    try {
      userHelper.addTheAddress(req.body).then((response) => {
        res.json(response);
      });
    } catch (err) {
      res.status(500);
    }
  },
  //rendring user wishlist..
  loadingWishlist: (req, res) => {
    try {
      let user = req.session.user;
      getUserWishlist(user._id).then((wishlist) => {
        wishlist = JSON.parse(JSON.stringify(wishlist));
        res.render("user/user-wishlist", { user, wishlist });
      });
    } catch (err) {
      res.status(500);
    }
  },
  //adding items to wishlist...
  addToWishlist: (req, res) => {
    try {
      userHelper.addItemToWishlist(req.body).then((response) => {
        res.json(response);
      });
    } catch (err) {
      res.status(500);
    }
  },
  // removing user address

  removeAddress: (req, res) => {
    try {
      let id = req.params.id;
      userHelper.deleteAddress(id).then((response) => {
        res.json(response);
      });
    } catch {
      res.status(500);
    }
  },
  paypalSuccess: (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "25.00",
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(payment);
          // console.log('payment succes',JSON.stringify(payment));
          res.redirect("/");
        }
      }
    );
  },

  paypalCancel: (req, res) => {
    try {
      res.send("Cancelled");
    } catch (err) {
      res.status(err);
    }
  },

  // user profile getting
  getUserProfile: async (req, res) => {
    try {
      let user = req.session.user;
      let userInfo = await userHelper.getUserInfo(user._id);
      userInfo = JSON.parse(JSON.stringify(userInfo));
      res.render("user/user-profile-edit", { user, userInfo });
    } catch (err) {
      res.status(err);
    }
  },

  updateUserInfo: (req, res) => {
    try {
      userHelper
        .userInfoUpdating(req.body, req.session.user._id)
        .then((status) => {
          res.json(status);
          let id = req.session.user._id;
          if (req.files) {
            let image = req.files.userImage;
            image.mv("./public/user-images/" + id + ".jpg");
          }
        });
    } catch (err) {
      res.status(500);
    }
  },

  verifyPayment: (req, res) => {
    try {
      userHelper
        .verifyingPayment(req.body)
        .then(() => {
          userHelper
            .changePaymentStatus(req.body["order[receipt]"])
            .then(() => {
              res.json({ status: true });
            });
        })
        .catch((err) => {
          console.log('the error',err);
          res.json({ status: false});
        });
    } catch (err) {
      res.status(500);
    }
  },
};
