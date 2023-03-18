import { Router } from "express";
const router = Router();
import { addToCart, changeProductQuantity, loadUserCart, userCartProductRemove } from "../controllers/cartController";
import { userChecking as auth } from '../middleware/sessionHandling'

router.route('/').get(auth, loadUserCart)

router.route('/add-to-cart/:id').put(auth, addToCart)

router.route('/change-product-quantity').patch(auth, changeProductQuantity);

router.route('/remove-cart-product').delete(auth, userCartProductRemove)


export default router;