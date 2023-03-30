import { Router } from "express";
const router = Router();
import { checkingAdmin as auth } from "../../middleware/sessionHandling";
import { handleGetSalesReport, handleCreateSalesReport } from "../../controllers/admin/salesReportController";

router.route('/').get(auth, handleGetSalesReport).post(auth, handleCreateSalesReport);


export default router