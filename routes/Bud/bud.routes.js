import express from "express";
import { detectSuitability, saveImage, getDetections } from "../../controllers/Bud/BudDetection.controller.js";

const router = express.Router();

router.post("/predict", detectSuitability);
router.post("/save", saveImage);
router.get("/get", getDetections);

export default router;