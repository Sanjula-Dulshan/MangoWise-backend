import express from "express";
import { detectVariety } from "../../controllers/Variety/ObjectDetectionController.js";
import {
  saveVarietyDetection,
  getDetections,
} from "../../controllers/Variety/Variety.controller.js";
import {
  market,
  getMarket,
} from "../../controllers/Variety/Market.controller.js";
const router = express.Router();

router.post("/predict", detectVariety);
router.post("/save", saveVarietyDetection);
router.get("/", getDetections);
router.post("/market", market);
router.get("/market", getMarket);

export default router;
