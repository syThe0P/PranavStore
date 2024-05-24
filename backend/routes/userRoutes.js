import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUserByID,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUserByID,
} from "../controllers/userController";
const router = express.Router();
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").post(logoutUser);

router.route("/me").get(authenticate, getUserDetails);
router.route("/password/update").put(authenticate, updatePassword);
router.route("/me/update").put(authenticate, updateProfile);

router
  .route("/admin/users")
  .get(authenticate, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(authenticate, authorizeRoles("admin"), getUserByID)
  .put(authenticate, authorizeRoles("admin"), updateUserByID)
  .delete(authenticate, authorizeRoles("admin"), deleteUser);

export default router;
