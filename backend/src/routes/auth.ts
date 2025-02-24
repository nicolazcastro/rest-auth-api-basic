import express from 'express';
import { confirmEmail, forgotPassword, resetPassword, refreshToken } from '../controllers/userController';

const router = express.Router();

router.get('/confirm-email', confirmEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

export default router;