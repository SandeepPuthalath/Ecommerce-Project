var express = require("express");
var router = express.Router();
const user_controller = require("../controllers/userControllers");
const page_controller = require("../controllers/pageController");
import { authenticationCheck as auth, userChecking } from "../middleware/sessionHandling";
import multer from "../middleware/multer";

/* GET home page. */
router.get("/", page_controller.loadLandingPage);
// login page rendering and submitting...

router
  .route("/login")
  .get(auth, user_controller.login)
  .post(user_controller.handleLogin);

// OTP login using mobile number..
router
  .route("/otp-login")
  .get(auth, user_controller.otpLogin)
  .post(user_controller.handleOtpSending);

// sending OTP to registered mobile number...

router
  .route("/otp-verifying")
  .get(auth, user_controller.otpVerification)
  .post(user_controller.handleOtpVerification);

// signup page rendering and submitting...
router
  .route("/signup")
  .get(auth, user_controller.handleGetSingup)
  .post(user_controller.handleSingnup);

//logging out from the user ...

router.get("/logout", user_controller.handleUserLogout);

//product listing in user side..
router.get("/product-view", page_controller.productListing);

//viewing product details....

router.get("/product/:id", page_controller.productView);

//Image zoom rendering page

router.get("/user/image-zoom/:id", page_controller.getImageZoomPage);

//Cart rendering for user ...

// router.get(
//   "/user/user-cart",
//   userChecking,
//   user_controller.loadUserCart
// );

//adding product to cart...

// router.get(
//   "/user/add-to-cart/:id",
//   userChecking,
//   user_controller.addToCart
// );

// changin the quantity of the product

// router.post("/change-product-quantity", user_controller.changeProductQuantity);

// removeing a product from the user cart

// router.post("/remove-cart-product", user_controller.userCartProductRemove);

// placing order of users

router
  .route("/place-order")
  .get(userChecking, user_controller.placeOrder)
  .post(user_controller.checkOut);

// rendering user-details page

router.get(
  "/user/user-details",
  userChecking,
  user_controller.getAccountSettings
);

// Cancelling user order ss

router.post("/user/order-cancel", user_controller.orderCancelling);

//adding address

router.post("/add-address", user_controller.addAddress);

//user whichlist

router.get(
  "/user-wishlist",
  userChecking,
  user_controller.loadingWishlist
);

//adding product to user wishlist..

router.post("/addToWishlist", user_controller.addToWishlist);

//deleting user Address

router.delete("/remove-address/:id", user_controller.removeAddress);

// paypal methods
router.get("/paypal_success", user_controller.paypalSuccess);

router.get("/cancel", user_controller.paypalCancel);

// adding item from wishlist to cart

router.put("/addFromWishlist/:prodId", user_controller.addFromWishlist);

//user profile editing page rendering....

router.get(
  "/user-profile-edit",
  userChecking,
  user_controller.getUserProfile
);

router.post(
  "/update-user-info",
  userChecking,
  multer.userProfileUpload,
  user_controller.updateUserInfo
);

// razorypay payment verifying

router.post("/verify-payment", user_controller.verifyPayment);

// paypal payment

router.post("/create_order", user_controller.paypalPayment);

// user wallet routers

router.get(
  "/user-wallet/:id",
  userChecking,
  user_controller.UserWallet
);

module.exports = router;
