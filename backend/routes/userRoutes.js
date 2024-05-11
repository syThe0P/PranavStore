import express from "express";
import {createUser, loginUser, logoutUser,getAllUsers, getCurrentUserProfile, updateCurrentUserProfile} from '../controllers/userController.js'
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/").post(createUser).get(authenticate, authorizeAdmin, getAllUsers);
router.route("/auth").post(loginUser);
router.route("/logout").post(logoutUser);

router.route("/profile").get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile);

export default router;
