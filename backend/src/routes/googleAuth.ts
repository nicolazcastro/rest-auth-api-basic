// backend/src/routes/googleAuth.ts
import express from 'express';
import passport from 'passport';

const router = express.Router();

// Initiate Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback route (must match GOOGLE_CALLBACK_URL in your .env)
router.get(
  '/google/authorized',
  passport.authenticate('google', { failureRedirect: '/api/v1/auth/google/failure', session: false }),
  (req, res) => {
    // Access token from req.user (using type assertion)
    const token = (req as any).user.token;
    // Redirect to frontend with token as query parameter
    res.redirect(`${process.env.FRONTEND_BASE_URL}/?token=${token}`);
  }
);

// Failure route for Google OAuth
router.get('/google/failure', (req, res) => {
  res.status(401).json({ status: 'error', message: 'Google authentication failed' });
});

export default router;