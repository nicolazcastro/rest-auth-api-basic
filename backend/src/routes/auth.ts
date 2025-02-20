import express from 'express';
import { confirmEmail, forgotPassword, resetPassword } from '../Controllers/userController';

const router = express.Router();

router.get('/confirm-email', confirmEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;