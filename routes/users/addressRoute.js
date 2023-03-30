import { Router } from "express"
const router = Router();
import { userChecking as auth } from "../../middleware/sessionHandling";
import { handleGetAddress, handleUpdateAddress, handleDeleteAddress} from "../../controllers/users/addressController";

router.route('/:id').get(auth, handleGetAddress).put(auth, handleUpdateAddress).delete(auth, handleDeleteAddress);



export default router