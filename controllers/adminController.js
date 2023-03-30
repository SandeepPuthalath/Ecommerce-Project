const adminHelper = require("../helpers/adminHelper");
import Order from '../model/orderModel';
import Category from '../model/categoryModel';



module.exports = {
  // rendering admin dashboard...
  adminDashboard: async (req, res) => {
    let paymentData;
    try {
      let admin = req.session.admin;
      const dashboardDetails = await adminHelper.getDashboardDetails();
      const chartData = await adminHelper.getChartDetails();
      Order.find().select('paymentMethod').exec((err, orders) => {
        if (err) {
          res.status(404).redirect('/error');
        } else {
          // payment method wise sales data 
          const payment = new Map();
          for (let i = 0; i < orders.length; i++) {
            if (!payment.has(orders[i].paymentMethod)) {
              payment.set(orders[i].paymentMethod, 1);
            } else {
              let count = payment.get(orders[i].paymentMethod) + 1
              payment.set(orders[i].paymentMethod, count);
            }
          }
          paymentData = Array.from(payment.values());

          res.render("admin/dashboard", {
            admin,
            totalOrders: dashboardDetails.totalOrders,
            totalRevenue: dashboardDetails.totalRevenue,
            monthlyRevenue: dashboardDetails.monthlyRevenue,
            totalProduct: dashboardDetails.totalProduct,
            chartData,
            paymentData,
          });
        }
      })

    } catch (err) {
      res.status(500);
    }
  },

  // getting all user data in a table format page rendering
  adminAllUser: (req, res) => {
    try {
      adminHelper.getAllUserDetails().then((userInfo) => {
        userInfo = JSON.parse(JSON.stringify(userInfo));
        let admin = req.session.admin;
        res.render("admin/all-user", { admin, userInfo });
      });
    }
    catch (err) {
      res.status(500);
    }
  },
  // for blocking the user
  accessRestricter: (req, res) => {
    let userId = req.params.id;
    adminHelper.blockUser(userId).then(() => {
      res.redirect("/admin/all-user");
    });
  },
  // add product page rendering ...
  addProduct: (req, res) => {
    try {
        Category.find().lean().then((category) => {
          console.log(category)
        let admin = req.session.admin;
        res.render("admin/add-product", {
          admin,
          productStatus: req.session.productStatus,
          category,
        });
        req.session.productStatus = false;
      });
    } catch (error) {
      res.status(500);
    }
  },
  // post method for adding products
  postAddProduct: (req, res) => {
    try {
      let images;
      if (req.files) {
        let imagesArray = (Object.values(req.files)).flat(1);
        images = imagesArray.map(files => {
          return {
            filename: files.filename,
            orignalname: files.originalname,
            mimetype: files.mimetype,
            path: files.path,
            size: files.size
          }
        })
      }
      adminHelper.addProduct(req.body, images).then((id) => {
        req.session.productStatus = "Product Added";
        res.redirect("/admin/add-product");
      });
    } catch (error) {
      res.status(500);
    }
  },
  // product listing page rendering
  productListing: (req, res) => {
    adminHelper.getAllProducts().then((product) => {
      let admin = req.session.admin;
      product = JSON.parse(JSON.stringify(product));
      res.render("admin/all-product", { admin, product });
    });
  },
  // for editing the information about the products
  editProduct: async (req, res) => {
    let category = await Category.find().lean();
    adminHelper.getProductDetails(req.params.id).then((product) => {
      const [product1] = product;
      product = JSON.parse(JSON.stringify(product1));
      let admin = req.session.admin;
      res.render("admin/edit-product", { admin, product, category, "productStatus": req.session.productStatus });
      req.session.productStatus = false;
    });
  },

  // post method for the editting
  postEditProduct: (req, res) => {
    let images = null;
    if (req.files) {
      let imagesArray = (Object.values(req.files)).flat(1);
      images = imagesArray.map(files => {
        return {
          filename: files.filename,
          orignalname: files.originalname,
          mimetype: files.mimetype,
          path: files.path,
          size: files.size
        }
      })
    }
    adminHelper.updateProduct(req.body, req.params.id, images).then((updatedProduct) => {
      req.session.productStatus = "Product info has been edited"
      res.redirect(`/admin/edit-product/${updatedProduct._id}`);
    });

  },
  // getting all categorys in the category collection page rendering
  getAllCategory: (req, res) => {
    adminHelper.getAllCategory().then((category) => {
      category = JSON.parse(JSON.stringify(category));
      let admin = req.session.admin;
      res.render("admin/category-list", { admin, category });
    });
  },
  // bothe category adding and listing are in the same page this the post method for adding category
  addCategory: (req, res) => {
    adminHelper
      .categoryListing(req.body)
      .then((category) => {
        res.redirect("/admin/category-list");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // listing and unlisting categorys..
  listCategory: (req, res) => {
    let categoryId = req.params.id;
    adminHelper.list_category(categoryId).then(() => {
      res.redirect("/admin/category-list");
    });
  },
  unlistCategory: (req, res) => {
    let categoryId = req.params.id;
    adminHelper.unlist_category(categoryId).then(() => {
      res.redirect("/admin/category-list");
    });
  },
  // deleting products from the database
  changeStatusProduct: (req, res) => {
    try {
      let productId = req.params.id;
      adminHelper
        .productStatusChanger(productId)
        .then((result) => {
          res.json(true);
        })
        .catch((err) => {
          res.json(err)
        });
    } catch (error) {
      res.status(500);
    }
  },

  //adming authentication page rendering  ...
  adminLogin: (req, res) => {
    try {
      res.render("admin/admin-login", {
        adminLoginErr: req.session.adminLoginErr,
      });
      req.session.adminLoginErr = false;
    } catch (err) {
      res.status(500);
    }
  },
  // verifying the cridentials given by the user
  adminLoginPost: (req, res) => {
    adminHelper
      .admin_login(req.body)
      .then((data) => {
        req.session.admin = data;
        req.session.adminStatus = true;
        res.redirect("/admin");
      })
      .catch((err) => {
        console.log(err);
        req.session.adminLoginErr = "Invalid Admin Email Or Password";
        res.redirect("/admin/admin-login");
      });
  },
  // distroying the admin session
  adminLogout: (req, res) => {
    req.session.admin = null;
    req.session.loginStatus = false;
    req.session.loggedOut = "you are successfully logged out";
    res.redirect("/api/admin/auth");
  },
  usersOrderDetails: async (req, res) => {
    try {
      let admin = req.session.admin;
      let orders = await adminHelper.getAllOrders();
      res.render("admin/all-order-details", { admin, orders });
    } catch (err) {
      res.status(500);
    }
  },
  addingBanner: (req, res) => {
    try {
      adminHelper.postBanner(req.body, req.file).then((id) => {
        res.json(true);
      });
    } catch (err) {
      res.status(500);
    }
  },
  getOrderDetails: async (req, res) => {
    try {
      let admin = req.session.admin;
      let orderId = req.params.id;
      let orderItems = await adminHelper.getAllOrderItem(orderId);
      let orderDetails = await adminHelper.getOrderDetails(orderId);
      res.render("admin/order-details", {
        admin,
        orderItems,
        orderId,
        orderDetails,
      });
    } catch (err) {
      res.status(500);
    }
  },

  // getting all banner detail

  addBanner: (req, res) => {
    let admin = req.session.admin;
    res.render("admin/add-banner", { admin });
  },

  getAllBannerDetails: async (req, res) => {
    try {
      console.log('got to banner list')
      let admin = req.session.admin;
      let banners = await adminHelper.getAllBanners();
      res.render("admin/banner-list", { admin, banners });
    } catch (error) {
      res.status(500);
    }
  },
  getBanner: (req, res) => {
    try {
      let bannerId = req.params.id;
      adminHelper.getBannerDetails(bannerId).then((result) => {
        if (result) {
          res.json(result);
        }
      });
    } catch (error) {
      res.status(500);
    }
  },
  updateBanner: (req, res) => {
    console.log(req.file);
    console.log(req.body);
    try {
      adminHelper.bannerUpdater(req.body, req.file).then(() => {
        res.json(true)
      }).catch((err) => {
        res.json(err);
      });

    } catch (error) {
      res.status(500);
    }
  },
  deleteBanner: (req, res) => {
    let bannerId = req.params.id;
    adminHelper.bannerDeleter(bannerId).then((status) => {
      res.json(true)
    }).catch((err) => {
      res.json(err);
    })
  }
};
