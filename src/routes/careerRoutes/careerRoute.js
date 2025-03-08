import express from "express";
import { isAuthenticated } from "../../middleWare/isAuth.js";
import { getAllCareers, getCarriedGuide, getUserProgress, markChapterCompleted, markSubtopicCompleted, startPursuingCareer } from "../../controllers/careerContrllers/careerController.js";
const router = express.Router();

// ✅ Get All Career Options

router.route("/get/careers").get(isAuthenticated, getAllCareers);
router.route("/get/careers/guide/:id").get(isAuthenticated, getCarriedGuide);
router.route("/start/pursuing").post(isAuthenticated, startPursuingCareer);
router.route("/complete/chapter").post(isAuthenticated, markChapterCompleted);
router.route("/complete/subtopic").post(isAuthenticated, markSubtopicCompleted); 
router.route("/get/progress/:careerPathId").get(isAuthenticated, getUserProgress);

export default router;
