import { Router } from "express"
const router = Router();
import { userChecking as auth } from "../../middleware/sessionHandling";
import { handleRemoveFromWishlist, handleMoveToCart } from "../../controllers/users/wishlistController";

router.route('/:id').put(auth, handleMoveToCart).delete(auth, handleRemoveFromWishlist)

export default router