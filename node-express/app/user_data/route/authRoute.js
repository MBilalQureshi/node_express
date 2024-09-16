import express from 'express';
import { refreshToken } from '../controller/authController.js';

const router = express.Router();

// Refresh token route
router.post('/refresh-token', refreshToken);

export default router;