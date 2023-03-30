import { Router } from "express";
const router = Router();
import { userChecking as auth } from "../../middleware/sessionHandling";
import { handleApplyCoupon, handleRemoveCoupon } from '../../controllers/users/couponController'


router.route('/').put(auth, handleApplyCoupon).delete(auth, handleRemoveCoupon)



export default router;