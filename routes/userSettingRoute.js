import express from "express";
const router = express.Router();
import {userChecking as auth } from "../middleware/sessionHandling";
import {
handleGetOrderDetails
} from "../controllers/userSettingController"

router.route('/:id')
    .get(auth, handleGetOrderDetails)


export default router;