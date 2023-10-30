import express from 'express';
const router = express.Router();

import { getLocationData } from '../controllers/suggest.controller.js';

router.get('/', getLocationData);

export default router;