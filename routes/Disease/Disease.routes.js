import express from "express";
import { detectDiseases } from "../../controllers/Disease/ObjectDetection.controller.js";
import {
  saveDetection,
  getDetections,
} from "../../controllers/Disease/Disease.controller.js";
const router = express.Router();

router.post("/", saveDetection);
router.get("/", getDetections);
router.post("/predict", detectDiseases);

export default router;
