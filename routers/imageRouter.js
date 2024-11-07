import express from 'express';
import { saveImage } from '../controllers/imageController.js';

const router = express.Router();

router.post('/save-image', saveImage);

export default router;