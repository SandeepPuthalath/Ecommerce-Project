var express = require('express');
var router = express.Router();
const admin_controller = require('../controllers/adminController');
const session_check = require('../middleware/sessionHandling');

/* GET admin Dashboard.... */
router.get('/', session_check.checkingAdmin, admin_controller.adminDashboard);

router.route('/admin-login').get(session_check.adminAuthenticationCheck, admin_controller.adminLogin).post(admin_controller.adminLoginPost);

// Getting all users details....

router.get('/all-user', session_check.checkingAdmin, admin_controller.adminAllUser);

//Blocking users....

router.get('/user-block/:id', admin_controller.userBlocking);

//Unblocking user...

router.get('/user-unblocking/:id', admin_controller.userUnblocking);

//Listing products in admin side ....

router.get('/all-product', session_check.checkingAdmin, admin_controller.productListing);

//admin product adding

router.route('/add-product').get(session_check.checkingAdmin, admin_controller.addProduct).post(admin_controller.postAddProduct);

//admin product editing ...

router.route('/edit-product/:id').get(session_check.checkingAdmin, admin_controller.editProduct).post(admin_controller.postEditProduct);

// Deleting product 

router.get('/delete-product/:id', admin_controller. changeStatusProduct);

//Rendering category management page ...

router.get('/category-list', session_check.checkingAdmin, admin_controller.getAllCategory);

//adding category to category collection

router.post('/add-category', admin_controller.addCategory);

// listing category

router.get('/list-category/:id', admin_controller.listCategory);

// unlisting category

router.get('/unlist-category/:id', admin_controller.unlistCategory);

// All order details listing page loading..

router.get('/all-order-details',session_check.checkingAdmin,admin_controller.usersOrderDetails);

// banner Adding

router.route('/add-banner').get(session_check.checkingAdmin,admin_controller.addBanner).post(admin_controller.addingBanner);

//admin logout..

router.get('/admin-logout', admin_controller.adminLogout);


module.exports = router;
