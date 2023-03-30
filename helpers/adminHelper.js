const userSchema = require("../model/userModel").default;
const productSchema = require("../model/productModel").default;
const categorySchema = require("../model/categoryModel").default;
const orderSchema = require("../model/orderModel").default;
import {default as bannerSchema} from "../model/bannerModel"
var objectId = require("mongodb").ObjectId;

let admin = {
  name: "Admin Sandeeep",
  email: "admin@gmail.com",
  password: "admin",
};

module.exports = {
  // getting the details of sales and orders
  getDashboardDetails: () => {
    return new Promise(async (resolve, reject) => {
      const currentMonth = new Date().getMonth() + 1;
      let totalRevenue, monthlyRevenue, totalProduct;
      let response = {};
      const totalOrders = await orderSchema.find({ status: "placed" }).count();
      response.totalOrders = totalOrders;
      if (totalOrders) {
        totalRevenue = await orderSchema.aggregate([
          {
            $match: { status: "placed" },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
            },
          },
        ]);
        response.totalRevenue = totalRevenue[0].total;
        monthlyRevenue = await orderSchema.aggregate([
          {
            $match: {
              status: "placed",
              createAt: {
                $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
            },
          },
        ]);
        response.monthlyRevenue = monthlyRevenue[0].total;
      }
      totalProduct = await productSchema.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$product_quantity" },
          },
        },
      ]);

      response.totalProduct = totalProduct[0].total;

      resolve(response);

    });
  },
  getChartDetails: () => {
    return new Promise(async (resolve, reject) => {
      const orders = await orderSchema.aggregate([
        {
          $match: { status: "placed" },
        },
        {
          $project: {
            _id: null,
            createdDate: "$createAt",
          },
        },
      ]);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      let monthlyObj = new Map();
      let dailyObj = new Map();
      // converting to monthy order array
      orders.forEach((obj) => {
        const date = new Date(obj.createdDate);
        const month = date.toLocaleDateString("en-US", { month: "short" });
        if (!monthlyObj.has(month)) {
          monthlyObj.set(month, 1);
        } else {
          let count = monthlyObj.get(month) + 1;
          monthlyObj.set(month, count);
        }
      });
      let monthlyData = [];
      for (let i = 0; i < months.length; i++) {
        if (monthlyObj.has(months[i])) {
          monthlyData.push(monthlyObj.get(months[i]));
        }
        else {
          monthlyData.push(0);
        }

      }
      // converting to dayly order array
      orders.forEach(obj => {
        const date = new Date(obj.createdDate);
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        if (!dailyObj.has(day)) {
          dailyObj.set(day, 1);
        }
        else {
          let count = dailyObj.get(day) + 1;
          dailyObj.set(day, count);
        }
      })
      let dailyData = []
      for (let i = 0; i < days.length; i++) {
        if (dailyObj.has(days[i])) {
          dailyData.push(dailyObj.get(days[i]));
        }
        else {
          dailyData.push(0);
        }
      }
      resolve({ monthlyData: monthlyData, dailyData: dailyData });
    });
  },
  getAllUserDetails: () => {
    return new Promise(async (resolve, reject) => {
      let userData = await userSchema.find();
      if (userData) {
        resolve(userData);
      } else {
        reject({ status: false });
      }
    });
  },
  blockUser: (userId) => {
    return new Promise((resolve, reject) => {
      userSchema
        .findById(objectId(userId),
          async function (err, user){
            if(err){
              reject(err);
            }
            else{
              user.access = !user.access;
              await user.save((err) =>{
                if(err){
                  reject(err)
                }
              })
              resolve()
            }
          }
          )
    });
  },
  unblockUser: (userId) => {
    return new Promise((resolve, reject) => {
      userSchema
        .updateOne({ _id: userId }, { $set: { access: true } })
        .then(() => {
          resolve({ status: true });
        });
    });
  },
  addProduct: (productData, images) => {
    return new Promise(async (resolve, reject) => {
      let product = new productSchema({
        product_name: productData.name,
        product_category: productData.category,
        product_price: productData.price,
        product_description: productData.description,
        product_quantity: productData.quantity,
        product_images: images
      });
      await product.save();
      resolve(product._id);
    });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await productSchema.find();
      resolve(products);
    });
  },
  getProductDetails: (productId) => {
    return new Promise(async (resolve, reject) => {
      let product = await productSchema.find({ _id: objectId(productId) });
      resolve(product);
    });
  },
  updateProduct: (product, productId, newImages) => {
    return new Promise((resolve, reject) => {
      const { name, category, price, quantity, description } = product;

      if (newImages.length) {
        productSchema.findOneAndUpdate(
          {
            _id: objectId(productId),
          },
          {
            $set: {
              product_name: name,
              product_category: category,
              product_price: price,
              product_quantity: quantity,
              product_description: description,
              product_images: newImages
            }
          }
        ).then(updatedProduct => {
          resolve(updatedProduct);
        })
      }
      else {
        productSchema
          .findOneAndUpdate(
            { _id: objectId(productId) },
            {
              $set: {
                product_name: name,
                product_category: category,
                product_price: price,
                product_quantity: quantity,
                product_description: description
              }
            }
          )
          .then((updatedProduct) => {
          
            resolve(updatedProduct);
          });
      }

    });
  },
  categoryListing: (categoryData) => {
   
    return new Promise(async (resolve, reject) => {
      let category = await new categorySchema({
        category_name: categoryData.category,
        category_view: true,
      });
      await category.save();
      resolve(category._id);
    });
  },
  getAllCategory: () => {
    return new Promise(async (resolve, reject) => {
      let category = await categorySchema.find();
      resolve(category);
    });
  },
  list_category: (categoryId) => {
    return new Promise((resolve, reject) => {
      categorySchema
        .updateOne(
          { _id: objectId(categoryId) },
          { $set: { category_view: true } }
        )
        .then(() => {
          resolve();
        });
    });
  },
  unlist_category: (categoryId) => {
    return new Promise((resolve, reject) => {
      categorySchema
        .updateOne(
          { _id: objectId(categoryId) },
          { $set: { category_view: false } }
        )
        .then(() => {
          resolve();
        });
    });
  },
  productStatusChanger: (productId) => {
    return new Promise((resolve, reject) => {
      productSchema.findOne(
        {
          _id: objectId(productId),
        },
        (err, product) => {
          if (err) {
            reject(err)
          }
          else {
            product.product_status = !product.product_status

            product.save((err, updatedProduct) => {
              if (err) {
                reject(err)
              }
              else {
                resolve(updatedProduct);

              }
            })
          }
        }
      )
    });
  },
  admin_login: (loginDetails) => {
    return new Promise((resolve, reject) => {
      if (
        admin.email === loginDetails.email &&
        admin.password === loginDetails.password
      ) {
        resolve(admin);
      } else {
        reject({ status: false });
      }
    });
  },
  getAllOrders: () => {
    return new Promise((resolve, reject) => {
      orderSchema
        .find().sort({createAt: -1})
        .then((orderDetails) => {
          let updatedOrders = orderDetails.map((order) => {
            if (order.status === "placed") {
              return { ...order, tag: "success" };
            } else if (order.status === "cancelled") {
              return { ...order, tag: "danger" };
            } else {
              return { ...order, tag: "warning" };
            }
          });

          updatedOrders = JSON.parse(JSON.stringify(updatedOrders));
          resolve(updatedOrders);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  postBanner: (banners, image) => {
    return new Promise(async (resolve, reject) => {
      let banner = new bannerSchema({
        title1: banners.title1,
        title2: banners.title2,
        title3: banners.title3,
        description: banners.description,
        discount: parseInt(banners.discount),
        tagName: banners.tag,
        bannerImg: image.path
      });

      await banner.save();

      resolve(banner._id);
    });
  },
  getAllOrderItem: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let orderedItem = await orderSchema.aggregate([
        {
          $match: { _id: objectId(orderId) },
        },
        {
          $unwind: "$orderedItems",
        },
        {
          $project: {
            item: "$orderedItems.item",
            quantity: "$orderedItems.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "item",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] },
          },
        },
      ]);
      orderedItem = JSON.parse(JSON.stringify(orderedItem));
      resolve(orderedItem);
    });
  },
  getOrderDetails: (orderId) => {
    return new Promise((resolve, reject) => {
      orderSchema.findOne({ _id: objectId(orderId) }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        resolve(result);
      });
    });
  },
  getAllBanners: () => {
    return new Promise( async (resolve, reject) => {
     const banners = await bannerSchema.find({}).lean();
        resolve(banners)
    });
  },

  getBannerDetails: (bannerId) => {
    return new Promise((resolve, reject) => {
      bannerSchema
        .findOne({ _id: objectId(bannerId) })
        .then((bannerDetails) => {
          resolve(bannerDetails);
        });
    });
  },

  bannerUpdater: (updateInfo, imageFile) => {
    return new Promise((resolve, reject) => {
      const { title1, title2, title3, discount, tag, bannerId, description } = updateInfo;
      if (imageFile) {
        bannerSchema.updateOne(
          { _id: objectId(bannerId) },
          {
            $set: {
              title1: title1,
              title2: title2,
              title3: title3,
              discount:parseInt(discount),
              tag: tag,
              description: description,
              bannerImg : imageFile.path
            },
            upsert : true
          }
        ).then((result) =>{
          resolve();
        }).catch((err) =>{
          reject(err);
        })
      }
      else {
        bannerSchema.updateOne(
          { _id: objectId(bannerId) },
          {
            $set: {
              title1: title1,
              title2: title2,
              title3: title3,
              discount:parseInt(discount),
              tag: tag,
              description: description,
            }
          }
        ).then((result) =>{
          resolve()
        }).catch((err) =>{
          reject(err);
        })
      }
    })
  },
  bannerDeleter : (bannerId) =>{
    return new Promise((resolve, reject) =>{
      bannerSchema.deleteOne({_id : objectId(bannerId)}).then((res) =>{
        resolve(true);
      }).catch((err) =>{
        reject(err);
      })
    })
  }
};
