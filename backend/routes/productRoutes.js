import express from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/productController.js";
const router = express.Router();

router.route('/product/new').post(createProduct);
router.route('/products').get(getAllProducts);
router.route('/product/:id').put(updateProduct).delete(deleteProduct)


export default router;