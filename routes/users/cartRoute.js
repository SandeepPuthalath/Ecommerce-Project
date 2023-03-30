import { Router } from "express"
const router = Router();
import { addToCart, changeProductQuantity, loadUserCart, userCartProductRemove } from "../../controllers/users/cartController";
import { userChecking as auth } from '../../middleware/sessionHandling'
import {checkForProductStock as verifyProduct} from '../../middleware/inventoryManagement'

router.route('/').get(auth, loadUserCart)

router.route('/add-to-cart/:id').put(auth, verifyProduct, addToCart)

router.route('/change-product-quantity').patch(auth, changeProductQuantity)

router.route('/remove-cart-product').delete(auth, userCartProductRemove)


export default router