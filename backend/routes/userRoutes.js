import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";
import { authenticate,authorizeRoles} from "../middlewares/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(registerUser)
  .get(authenticate,authorizeRoles("admin"),  getAllUsers);
router.route("/auth").post(loginUser);
router.route("/logout").post(authenticate,logoutUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

//Admin routes
router
  .route("/:id")
  .delete(authenticate,authorizeRoles("admin"),  deleteById)
  .get(authenticate,authorizeRoles("admin"),  getUserById)
  .put(authenticate,authorizeRoles("admin"), updateUserById); 

export default router;
