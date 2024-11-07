import express from 'express';
import { generatePuzzle } from '../controllers/puzzleController.js';

const router = express.Router();

router.post('/', generatePuzzle);

export default router;