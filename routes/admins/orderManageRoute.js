import { Router } from "express";
const router = Router();
import { handleChangeOrderStatus } from "../../controllers/admin/orderManagement";
import { checkingAdmin as auth } from "../../middleware/sessionHandling";


router.patch('/:id', auth, handleChangeOrderStatus);


export default router