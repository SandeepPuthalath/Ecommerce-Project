import { getCartItemCount, getWishListCount, pageProductLoading, bannerLoading, productView as _productView } from "../helpers/productHelper";
import { getUserInfo } from "../helpers/userHelper";
let cartCount = null;
let wishlistCount = null;
let userInfo = null;

export async function loadLandingPage(req, res) {
  let user = req.session.user;
  if (user) {
    cartCount = await getCartItemCount(user);
    wishlistCount = await getWishListCount(user);
    userInfo = await getUserInfo(user._id)
    console.log(userInfo)
  }
  pageProductLoading().then(async (product) => {
    product = JSON.parse(JSON.stringify(product));
    let banners = await bannerLoading();
    banners = JSON.parse(JSON.stringify(banners));
    res.render("index", {
      user_header: true,
      user,
      product,
      banners,
      logged_out: req.session.loggedOut,
      cartCount,
      wishlistCount,
      userInfo
    });
    req.session.loggedOut = false;
  });
}
export function productListing(req, res) {
  try {
    let user = req.session.user;
    pageProductLoading().then((product) => {
      product = JSON.parse(JSON.stringify(product));
      res.render("user/product-view", {
        user_header: true,
        user,
        product,
        cartCount,
        wishlistCount,
      });
    });
  } catch (err) {
    res.status(500);
  }
}
export function productView(req, res) {
  let productId = req.params.id;
  let user = req.session.user;
  _productView(productId).then((product) => {
    product = JSON.parse(JSON.stringify(product));
    res.render("user/product", {
      user_header: true,
      product,
      user,
      cartCount,
      wishlistCount,
    });
  });
}
export function getImageZoomPage(req, res) {
  let id = req.params.id;
  let user = req.session.user;
  res.render("user/image-zoom", { user_header: true, id, user });
}
