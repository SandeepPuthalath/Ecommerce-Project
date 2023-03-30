import { Router } from "express";
const router = Router();
import { checkingAdmin as auth } from "../../middleware/sessionHandling";
import {
    handleGetAllCategories,
    handleCreateCategory,
    handleCategoryStatusChange,
    hangleDeleteCategory,
    handleGetCategory,
    handleUpdateCategory
} from "../../controllers/admin/categoryController";

router.route('/')
    .get(auth, handleGetAllCategories)
    .post(auth, handleCreateCategory);
router.route('/:id')
    .get(auth, handleGetCategory)
    .put(auth, handleUpdateCategory)
    .patch(auth, handleCategoryStatusChange)
    .delete(auth, hangleDeleteCategory)

export default router;