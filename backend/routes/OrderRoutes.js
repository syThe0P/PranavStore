import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import { deleteOrder, getAllOrders, getOrders, getSingleOrder, newOrder, updateOrder } from "../controllers/orderController.js";
const router = express.Router();


router.route("/order/new").post(authenticate, newOrder)
router.route("/order/:id").get(authenticate, getSingleOrder)
router.route("/order/me").get(authenticate, getOrders);

router.route("/admin/orders").get(authenticate, authorizeRoles("admin"), getAllOrders)
router.route("/admin/order/:id").put(authenticate, authorizeRoles("admin"), updateOrder).delete(authenticate, authorizeRoles("admin"),deleteOrder)

export default router;