import { Router } from 'express';
import { extractProfile, chat, analyzeResume, generateCoverLetter } from '../controllers/ai.controller.js';

const router = Router();
router.post('/extract', extractProfile);
router.post('/chat', chat);
router.post('/analyze-resume', analyzeResume);
router.post('/generate-cover-letter', generateCoverLetter);

export default router;

