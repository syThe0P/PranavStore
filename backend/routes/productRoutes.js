import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getProductDetails,
  getProductReviews,
  updateProduct,
} from "../controllers/productController.js";
const router = express.Router();

router
  .route("/product/new")
  .post(authenticate, authorizeRoles("admin"), createProduct);
router.route("/products").get(getAllProducts);
router
  .route("/admin/product/:id")
  .put(authenticate, authorizeRoles("admin"), updateProduct)
  .delete(authenticate, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(authenticate, createProductReview)
router.route("/reviews").get(getProductReviews).delete(authenticate,deleteReview)

export default router;
