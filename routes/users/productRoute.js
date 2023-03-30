import { Router } from "express";
const router = Router();
import { handleProductSearch, handleGetProduct, handleProductSearchResult, handleCategoryFiltering } from "../../controllers/users/productController";

router.route('/').get(handleGetProduct)

router.route('/search').post(handleProductSearch)

router.get('/search/result', handleProductSearchResult);

router.get('/filter/category', handleCategoryFiltering);


export default router