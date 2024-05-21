import express from "express";
import { authenticate,authorizeRoles} from "../middlewares/authMiddleware.js";
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from "../controllers/productController.js";
const router = express.Router();

router.route('/product/new').post(authenticate,authorizeRoles("admin"),createProduct);
router.route('/products').get(authenticate, authorizeRoles("admin"),getAllProducts);
router.route('/product/:id').put(authenticate,authorizeRoles("admin"), updateProduct).delete(authenticate,authorizeRoles("admin"), deleteProduct).get(authenticate,authorizeRoles("admin"), getProductDetails)


export default router;