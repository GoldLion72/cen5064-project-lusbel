import express from 'express';
const router = express.Router();
import { findEvents } from '../controllers/progressController.js';

router.get('/progress', findEvents);

export default router;
