import express from "express";
const router = express.Router();
import { checkingAdmin as auth } from "../../middleware/sessionHandling";
import {
    handleGetAllCoupons,
    handleCreateCoupon,
    handleGetCouponById,
    handleEditCoupon
} from "../../controllers/admin/couponController"


router.route('/')
    .get(auth, handleGetAllCoupons)
    .post(auth, handleCreateCoupon);

router.route('/:id')
    .get(auth, handleGetCouponById)
    .put()
    .patch()
    .delete()

router.patch('/edit', auth, handleEditCoupon)

export default router;