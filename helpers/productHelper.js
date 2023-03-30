const productSchema = require("../model/productModel").default;
const bannerSchema = require("../model/bannerModel").default;
const cartSchema = require("../model/cartModel").default;
const wishlistSchema = require("../model/wishlistModel").default;
const objectId = require("mongodb").ObjectId;

module.exports = {
  pageProductLoading: () => {
    return new Promise(async (resolve, reject) => {
      let product = await productSchema.find();
      resolve(product);
    });
  },
  bannerLoading: () => {
    return new Promise(async (resolve, reject) => {
      let banners = await bannerSchema.find();
      resolve(banners);
    });
  },
  productView: (productId) => {
    return new Promise(async (resolve, reject) => {
      let product = await productSchema.findOne({ _id: objectId(productId) });
      resolve(product);
    });
  },
  getCartItemCount: (user) => {
    return new Promise((resolve, reject) => {
      if (user) {
        cartSchema.aggregate([
          {
            $match: { user: objectId(user._id) },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              quantity: "$product.quantity",
            },
          },
          {
            $group: {
              _id: null,
              totalQty: { $sum: "$quantity" },
            },
          },
          {
            $project : {
                _id : 1, totalQty : 1
            }
          }
        ]).then((result) =>{
            result= JSON.parse(JSON.stringify(result))
            resolve(result[0]);
        })
      } else {
        resolve(null);
      }
    });
  },
  getWishListCount : (user) =>{
    return new Promise( async (resolve, reject) =>{
        if(user){
          const wishList = await wishlistSchema.findOne({userId: objectId(user._id)}).select('product');
          if(wishList){
           resolve(wishList.product.length);
          }
          else{
            resolve(null);
          }
        }
        else{
            resolve(null)
        }
    })
  }
};
