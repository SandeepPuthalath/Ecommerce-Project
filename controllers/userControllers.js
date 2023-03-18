import { doLogin, checkForUser, doSignup, addToUserCart, wishlistToCart, getTotalAmount, getUserCart, changeCartQuantity, removeCartProduct, getCartProductList, placingOrder, removeAllProducts, orderDetails as _orderDetails, orderHistory as _orderHistory, removeOrder, addTheAddress, addItemToWishlist, deleteAddress, changePaymentStatus, getUserInfo, userInfoUpdating, verifyingPayment, getUserWallet } from "../helpers/userHelper";
import { getCartItemCount, getWishListCount } from "../helpers/productHelper";
import User from "../model/userModel";
import { sendOtp, verifyOtp } from "../api/twilio";
import Address from "../model/addressModel";
import { getUserWishlist } from "../helpers/userHelper";
import { ObjectId as objectId } from "mongodb";
import { processRazorpay } from "../api/razorpay";
import { core, orders } from "@paypal/checkout-server-sdk";
import { Convert } from "easy-currencies";
import { comparePassword, encryptPassword } from "../api/encryption";

const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;

const Environment =
  process.env.NODE_ENV === "production"
    ? core.LiveEnvironment
    : core.SandboxEnvironment;
const paypalClient = new core.PayPalHttpClient(
  new Environment(client_id, client_secret)
);

// user handling controller function start
// Rendering the singup page
export function handleGetSingup(req, res) {
  try {
    res.render("user/signup", {
      user_header: true
    });
  } catch (error) {
    res.status(404);
  }
}
// Singnup proccessing
export async function handleSingnup(req, res) {
  try {
    const user = await encryptPassword(req.body);
    console.log(user)
    const newUser = await User(user);
    await newUser.save();
    res.status(202).json('User has been create successfully!')
  } catch (error) {
    if (error.code == 11000) {
      res.status(404).json({ error: "User Already exists" })
    }
    else {
      res.status(404)
    }
  }
}
// user login page 
export async function login(req, res) {
  try {
    res.render("user/login", {
      user_header: true,
    });
  } catch (err) {
    res.status(500);
  }
}
// login processing 
export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Login failed. Please try again.' });
    }
    const passwordMatch = await comparePassword(password, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Login failed. Please try again.' });
    }
    req.session.user = user;
    return res.status(202).json({ message: 'Login successfull' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
}
//otp login page
export function otpLogin(req, res) {
  try {
    res.render("user/otp-login", {
      user_header: true,
    });
  } catch (error) {
    res.status(500).json({message : 'Internal sever error'});
  }

}
//otp login processing
export function handleOtpSending(req, res) {
  const find = req.body;
  try {
    req.session.phone = req.body.phone
    User.findOne(find, async (err, user) =>{
      if(err){
        console.log(err)
        res.status(401).json({message : "somthing went wrong"})
      } else if(user){
        req.session.tempUser = user;
        await sendOtp(find.phone);
        console.log('otp sended')
        res.status(202).json({message : "Otp has been send successfully"});
      } else {
        res.status(401).json({message : "User dose not exists"})
      }
    })
    
  } catch (error) {
    res.status(500)
  }
}
// otp verification page
export function otpVerification(req, res) {
  try {
    if(req.session.phone){
      res.render("user/otp-verifying");
    }
    else{
      res.redirect('/otp-login');
    }
   
  } catch (error) {
    res.status(500)
  }
 
}
// otp verifiication processing
export async function handleOtpVerification(req, res) {
  const phone = req.session.phone;
  const otp = req.body.otp;
  console.log(phone, otp);
  try {
   const status = await verifyOtp(phone, otp);
   console.log(status)
   if(status){
    console.log('status is true')
    req.session.user = req.session.tempUser
    res.status(202).json({message: 'Login successfull'})
   }
   else{
    req.session.tempUser = null;
    res.status(401).json({message: 'The entered otp is invalid'})
   }
  } catch (error) {
  res.status(500) 
  }
  // let mobile = req.session.mobile;
  // let enteredOtp = req.body.otp;
  // let user = await checkForUser(mobile);
  // verifyOtp(mobile, enteredOtp).then((status) => {
  //   if (status.valid) {
  //     req.session.user = user;
  //     res.redirect("/");
  //   } else {
  //     req.session.otpErr = " OTP does not match";
  //     res.redirect("/otp-verifying");
  //   }
  // });
}

export function handleUserLogout(req, res) {
  try {
    req.session.user = null;
    res.status(202).json({message: "You have logged out successfully"})
  } catch (error) {
    res.status(500);
  }
}

//user handling function end

export async function placeOrder(req, res) {
  let user = req.session.user;
  try {
    
    let total = await getTotalAmount(req.session.user._id);
    let cartCount = await getCartItemCount(user);
    let wishlistCount = await getWishListCount(user);
    console.log('place order')
    let userAddress = await Address.find({
      userId: objectId(user._id),
    });
    let products = await getUserCart(user._id);
    products = JSON.parse(JSON.stringify(products));
    userAddress = JSON.parse(JSON.stringify(userAddress));
    res.render("user/place-order", {
      user,
      total,
      userAddress,
      products,
      cartCount,
      wishlistCount,
    });
  } catch (err) {
    res.status(500);
  }
}
export async function checkOut(req, res) {
  try {
    let products = await getCartProductList(req.body.userId);
    let totalAmount = await getTotalAmount(req.body.userId);
    req.session.amount = totalAmount;

    if (req.body["payment_option"] == "cod") {
      placingOrder(req.body, products, totalAmount)
        .then(async (orderDetails) => {
          await removeAllProducts(req.body.userId);
          let redirect_urls = "/api/cart";
          res.json({ success: "cod", redirect_urls, orderDetails });
        });
    } else if (req.body["payment_option"] == "paypal") {
      placingOrder(req.body, products, totalAmount)
        .then(async (orderDetails) => {
          req.session.orderId = orderDetails._id;

          let value = parseInt(
            await Convert(totalAmount).from("INR").to("USD")
          );
          res.json({ success: "paypal", value });
        });
    } else if (req.body["payment_option"] == "razorpay") {
      placingOrder(req.body, products, totalAmount)
        .then(async (orderDetails) => {
          await removeAllProducts(req.body.userId);
          processRazorpay(orderDetails._id, totalAmount).then((order) => {
            res.json({ success: "razorpay", order, orderDetails });
          });
        });
    }
  } catch (err) {
    res.sendStatus(500);
  }
}





export function addFromWishlist(req, res) {
  try {
    let prodId = req.params.prodId;
    let userId = req.session.user._id;

    wishlistToCart(prodId, userId).then((response) => {
      res.json(response);
    });
  } catch (err) {
    res.status(500);
  }
}


export async function getAccountSettings(req, res) {
  let user = req.session.user;
  let orderDetails = await _orderDetails(user._id);
  let orderHistory = await _orderHistory(user._id);
  let cartCount = await getCartItemCount(user);
  let wishlistCount = await getWishListCount(user);
  orderDetails = JSON.parse(JSON.stringify(orderDetails));
  orderHistory = JSON.parse(JSON.stringify(orderHistory));
  res.render("user/user-details", {
    user,
    orderDetails,
    orderHistory,
    cartCount,
    wishlistCount,
  });
}
export function orderCancelling(req, res) {
  try {
    removeOrder(req.body.orderId).then((response) => {
      res.json(response);
    });
  } catch (err) {
    res.status(500);
  }
}
export function addAddress(req, res) {
  try {
    addTheAddress(req.body).then((response) => {
      res.json(response);
    });
  } catch (err) {
    res.status(500);
  }
}
export async function loadingWishlist(req, res) {
  try {
    let user = req.session.user;
    let cartCount = await getCartItemCount(user);
    let wishlistCount = await getWishListCount(user);
    getUserWishlist(user._id).then((wishlist) => {
      wishlist = JSON.parse(JSON.stringify(wishlist));
      res.render("user/user-wishlist", {
        user,
        wishlist,
        cartCount,
        wishlistCount,
      });
    });
  } catch (err) {
    res.status(500);
  }
}
export function addToWishlist(req, res) {
  try {
    addItemToWishlist(req.body).then((response) => {
      res.json(response);
    });
  } catch (err) {
    res.status(500);
  }
}
export function removeAddress(req, res) {
  try {
    let id = req.params.id;
    deleteAddress(id).then((response) => {
      res.json(response);
    });
  } catch {
    res.status(500);
  }
}
export function paypalSuccess(req, res) {
  try {
    let orderId = req.session.orderId;
    changePaymentStatus(orderId).then(async () => {
      await removeAllProducts(req.session.userId);
      res.json({ status: true });
    });
  } catch (err) {
    res.status(500);
  }
}
export function paypalCancel(req, res) {
  try {
    res.send("Cancelled");
  } catch (err) {
    res.status(err);
  }
}
export async function getUserProfile(req, res) {
  try {
    let user = req.session.user;
    let cartCount = await getCartItemCount(user);
    let wishlistCount = await getWishListCount(user);
    res.render("user/user-profile-edit", {
      user,
      cartCount,
      wishlistCount,
    });
  } catch (err) {
    res.status(err);
  }
}
export function updateUserInfo(req, res) {
  const query = { _id: req.session.user._id }
  const update = { $set: {} }
  try {
    if (req.file) {
      update.$set[`userProfile`] = req.file.path;
    }

    if (Object.keys(req.body).length > 0) {
      for (let field in req.body) {
        update.$set[field] = req.body[field];
      }
    }
    console.log(update)
    User.findOneAndUpdate(query, update, (err, updatedUser) => {
      if (err) {
        console.log(err);
        res.status(401).json({ message: 'Somthing went wrong' });
      } else {
        console.log(updatedUser)
        res.status(202).json(updatedUser)
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'internal sever error' });
  }
}
export function verifyPayment(req, res) {
  try {
    verifyingPayment(req.body)
      .then(() => {
        changePaymentStatus(req.body["order[receipt]"])
          .then(() => {
            res.json({ status: true });
          });
      })
      .catch((err) => {
        console.log("the error", err);
        res.json({ status: false });
      });
  } catch (err) {
    res.status(500);
  }
}
export async function paypalPayment(req, res) {
  let total = req.body.total;
  total = parseInt(total);
  const request = new orders.OrdersCreateRequest();

  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
export function UserWallet(req, res) {
  try {
    let userId = req.params.id;
    getUserWallet(userId).then((walletBalance) => {
      res.json(walletBalance);
    });
  } catch (error) {
    res.status(500);
  }
}
