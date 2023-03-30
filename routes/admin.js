
import express from "express";
var router = express.Router();
import adminController from "../controllers/adminController";
import {adminAuthenticationCheck, checkingAdmin} from "../middleware/sessionHandling"
import multer from "../middleware/multer"


/* GET admin Dashboard.... */
router.get("/", checkingAdmin, adminController.adminDashboard);

// router
//   .route("/admin-login")
//   .get(adminAuthenticationCheck, adminController.adminLogin)
//   .post(adminController.adminLoginPost);

//Blocking users....

router.get("/user-block/:id", adminController.accessRestricter);

//Listing products in admin side ....

router.get(
  "/all-product",
  checkingAdmin,
  adminController.productListing
);

//admin product adding

router
  .route("/add-product")
  .get(checkingAdmin, adminController.addProduct)
  .post(checkingAdmin, multer.productUpload, adminController.postAddProduct);

//admin product editing ...

router
  .route("/edit-product/:id")
  .get(checkingAdmin, adminController.editProduct)
  .post(checkingAdmin, multer.productUpload, adminController.postEditProduct);

// Deleting product

router.patch("/changeProductStatus/:id", adminController.changeStatusProduct);

//Rendering category management page ...

router.get(
  "/category-list",
  checkingAdmin,
  adminController.getAllCategory
);

//adding category to category collection

router.post("/add-category", adminController.addCategory);

// listing category

router.get("/list-category/:id", adminController.listCategory);

// unlisting category

router.get("/unlist-category/:id", adminController.unlistCategory);

// All order details listing page loading..

router.get(
  "/all-order-details",
  checkingAdmin,
  adminController.usersOrderDetails
);

// banner Adding

router
  .route("/add-banner")
  .get(checkingAdmin, adminController.addBanner)
  .post(checkingAdmin, multer.bannerUpload, adminController.addingBanner);

// order details page

router.get(
  "/order-details/:id",
  checkingAdmin,
  adminController.getOrderDetails
);

// banner routers

router.get(
  "/banner-list",
  checkingAdmin,
  adminController.getAllBannerDetails
);

router.get(
  "/get-banner/:id",
  checkingAdmin,
  adminController.getBanner
);

router.post(
  "/update-banner",
  checkingAdmin,
  multer.bannerUpload,
  adminController.updateBanner
);

router.delete("/delete-banner/:id", checkingAdmin, adminController.deleteBanner);
//admin logout..

router.get("/admin-logout", adminController.adminLogout);

module.exports = router;
