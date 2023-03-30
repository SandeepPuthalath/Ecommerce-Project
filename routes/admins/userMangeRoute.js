import { Router } from "express";
const router = Router();
import {HandleGetAllUser, handleBlockUser} from '../../controllers/admin/userManagement'
import {checkingAdmin as auth} from '../../middleware/sessionHandling'

//geting all users details  
router.route('/').get(auth, HandleGetAllUser)

//getting user details by Id
router.route('/:id').patch(auth, handleBlockUser);

export default router

