import { Router } from "express";
const router = Router();
import { adminAuthenticationCheck as auth, checkingAdmin as adminAuth } from '../../middleware/sessionHandling'
import { handleGetLogin, handlePostLogin, handleAdminLogout } from '../../controllers/admin/authController';

// admin login page and post methoad
router.route('/').get(auth, handleGetLogin).post(auth, handlePostLogin);

//admin logout api
router.get('/logout', adminAuth, handleAdminLogout)

export default router;