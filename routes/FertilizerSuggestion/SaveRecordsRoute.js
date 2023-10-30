import express from 'express';
const router = express.Router();
import { saveRecord,getRecordById,getLastRecord,getAllRecords } from '../../controllers/FertilizerSuggestion/SaveRecordsController.js';


router.post("/add", saveRecord);

router.get("/get/:record_id", getRecordById);

router.get("/get", getLastRecord);

router.get("/getall", getAllRecords);

export default router;