import express from 'express';
const router = express.Router();
import { saveSuitableQuantity,findRecordByConditions,monitorNutrition } from '../../controllers/FertilizerSuggestion/SuitableQuantityController.js';



router.post("/add", saveSuitableQuantity);

router.post("/get", findRecordByConditions);

router.post("/monitor", monitorNutrition);

export default router;