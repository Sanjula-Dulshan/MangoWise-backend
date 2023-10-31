import express from 'express';
const router = express.Router();
import { saveRecord, getRecordById, getLastRecord, getAllRecordsByEmail } from '../../controllers/FertilizerSuggestion/SaveRecordsController.js';


router.post("/add", saveRecord);

router.get("/get/:record_id", getRecordById);

router.get("/get", getLastRecord);

router.get("/getall/:email", getAllRecordsByEmail);

export default router;