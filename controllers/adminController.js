const admin_helper = require("../helpers/adminHelper");


module.exports = {
  // rendering admin dashboard...
  adminDashboard: (req, res) => {
    try {
      let admin = req.session.admin;
      admin_helper.getDashboardDetails().then((response) => {
       
        res.render("admin/dashboard", {
          admin,
          totalOrders: response.totalOrders,
          totalRevenu: response.totalRevenu,
          totalQuantity: response.totalQuantity,
          monthlyOrders : response.monthlyCounts,
          daylyOrders : response.daylyCount
        });
      });
    } catch (err) {
      res.status(500);
    }
  },

  // getting all user data in a table format page rendering
  adminAllUser: (req, res) => {
    admin_helper.getAllUserDetails().then((userInfo) => {
      userInfo = JSON.parse(JSON.stringify(userInfo));
      let admin = req.session.admin;
      res.render("admin/all-user", { admin, userInfo });
    });
  },
  // for blocking the user
  userBlocking: (req, res) => {
    let userId = req.params.id;
    admin_helper.blockUser(userId).then((status) => {
      console.log("user blocked");
      res.redirect("/admin/all-user");
    });
  },
  // Unblocking the user
  userUnblocking: (req, res) => {
    let userId = req.params.id;
    admin_helper.unblockUser(userId).then((status) => {
      console.log("user unblocked");
      res.redirect("/admin/all-user");
    });
  },

  // add product page rendering ...
  addProduct: (req, res) => {
    admin_helper.getAllCategory().then((category) => {
      category = JSON.parse(JSON.stringify(category));
      let admin = req.session.admin;
      res.render("admin/add-product", {
        admin,
        productStatus: req.session.productStatus,
        category,
      });
      req.session.productStatus = false;
    });
  },
  // post method for adding products
  postAddProduct: (req, res) => {
    admin_helper.addProduct(req.body).then((id) => {
      req.session.productStatus = "Product Add";
      if (req.files) {
        let image = req.files.image;
        image.mv("./public/product-images/" + id + ".jpg", (err) => {
          if (!err) {
            res.redirect("/admin/add-product");
          } else {
            console.log(err);
          }
        });
      }
    });
  },
  // product listing page rendering
  productListing: (req, res) => {
    admin_helper.getAllProducts().then((product) => {
      console.log(product);
      let admin = req.session.admin;
      product = JSON.parse(JSON.stringify(product));
      res.render("admin/all-product", { admin, product });
    });
  },
  // for editing the information about the products
  editProduct: async (req, res) => {
    let category = await admin_helper.getAllCategory();
    category = JSON.parse(JSON.stringify(category));
    admin_helper.getProductDetails(req.params.id).then((product) => {
      const [product1] = product;
      product = JSON.parse(JSON.stringify(product1));
      let admin = req.session.admin;
      res.render("admin/edit-product", { admin, product, category });
    });
  },
  // post method for the editting
  postEditProduct: (req, res) => {
    admin_helper.updateProduct(req.body, req.params.id).then(() => {
      let id = req.params.id;
      res.redirect("/admin/all-product");
      if (req.files) {
        let image = req.files.image;
        image.mv("./public/product-images/" + id + ".jpg");
      }
    });
  },
  // getting all categorys in the category collection page rendering
  getAllCategory: (req, res) => {
    admin_helper.getAllCategory().then((category) => {
      category = JSON.parse(JSON.stringify(category));
      let admin = req.session.admin;
      res.render("admin/category-list", { admin, category });
    });
  },
  // bothe category adding and listing are in the same page this the post method for adding category
  addCategory: (req, res) => {
    admin_helper
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
    admin_helper.list_category(categoryId).then(() => {
      res.redirect("/admin/category-list");
    });
  },
  unlistCategory: (req, res) => {
    let categoryId = req.params.id;
    admin_helper.unlist_category(categoryId).then(() => {
      res.redirect("/admin/category-list");
    });
  },
  // deleting products from the database
  changeStatusProduct: (req, res) => {
    let productId = req.params.id;
    admin_helper
      .productStatusChanger(productId)
      .then(() => {
        res.redirect("/admin/all-product");
      })
      .catch((err) => {
        console.log(err);
      });
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
    admin_helper
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
    res.redirect("/admin/admin-login");
  },
  usersOrderDetails: async (req, res) => {
    let admin = req.session.admin;
    let orderDetails = await admin_helper.getAllOrders();
    orderDetails = JSON.parse(JSON.stringify(orderDetails));
    res.render("admin/all-order-details", { admin, orderDetails });
  },

  // Banner controller functions
  addBanner: (req, res) => {
    let admin = req.session.admin;
    res.render("admin/add-banner", { admin });
  },
  addingBanner: (req, res) => {
    try {
      admin_helper.postBanner(req.body).then((id) => {
        res.json(true);
        if (req.files) {
          let image = req.files.image;
          image.mv("./public/banner-images/" + id + ".jpg");
        }
      });
    } catch (err) {
      res.status(500);
    }
  },
};
