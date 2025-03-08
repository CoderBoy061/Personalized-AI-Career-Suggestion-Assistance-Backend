import express from "express";
import passport from "passport";
import { isAuthenticated } from "../../middleWare/isAuth.js";
import { addEducation, addProfession, getUser, googleAuth } from "../../controllers/userControllers/userController.js";
import clearCacheMiddleware from "../../middleWare/removeCache.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
// ✅ Google OAuth Callback → Calls Controller
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuth
);

// ✅ Get Logged-in User Data (Check Login Status)
router.get("/user", isAuthenticated, getUser);
router.patch("/user/education", isAuthenticated, clearCacheMiddleware,addEducation);
router.patch("/user/professional", isAuthenticated,clearCacheMiddleware, addProfession);
export default router;
