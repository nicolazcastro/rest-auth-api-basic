import * as userServices from '../services/users/usersServices';
import { Request, Response } from 'express';
import { decodeToken, validateRefreshToken } from '../utils/jwt.utils';
import { validateUserData } from '../utils/validation';
import { sendEmail } from '../services/common/emailService';
import crypto from 'crypto';

/**
 * Registration endpoint.
 * - If ENABLE_EMAIL_CONFIRMATION is "1", registers the user with emailConfirmed=false,
 *   generates a confirmation token, sends a confirmation email, and returns a message.
 * - Otherwise, sets emailConfirmed=true and logs in the user immediately.
 */
export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const validation = validateUserData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ status: "error", errors: validation.errors });
    }
    
    const existingUser = await userServices.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).json({ status: "error", message: "Email already in use" });
    }
    
    if (!req.body.userId) {
      req.body.userId = await userServices.getNextUserId();
    }
    
    req.body.emailConfirmed = process.env.ENABLE_EMAIL_CONFIRMATION === "1" ? false : true;
    let emailConfirmationEnabled = false;
    
    if (process.env.ENABLE_EMAIL_CONFIRMATION === "1") {
      const token = crypto.randomBytes(20).toString('hex');
      if (!token) {
        return res.status(500).json({ status: "error", message: "Failed to generate confirmation token." });
      }
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      emailConfirmationEnabled = true;
      req.body.emailConfirmationToken = token;
      req.body.emailConfirmationExpires = expires;
    }
    
    const newUser = await userServices.register(req.body);
    
    if (process.env.ENABLE_EMAIL_CONFIRMATION === "1") {
      const confirmationLink = `${process.env.FRONTEND_BASE_URL}/confirm-email?confirm-token=${newUser.emailConfirmationToken}`;
      
      await sendEmail({
        to: newUser.email,
        subject: 'Please confirm your email',
        html: `<p>Hello ${newUser.name},</p>
               <p>Please click the link below to confirm your email address. This link will expire in 24 hours:</p>
               <a href="${confirmationLink}">${confirmationLink}</a>`
      });
      
      return res.status(201).json({ 
        status: "success", 
        emailConfirmationEnabled: emailConfirmationEnabled,
        message: "Registration successful. Please check your email to confirm your account."
      });
    } else {
      // For immediate login, generate both tokens.
      const tokenResponse = {
        accessToken: userServices.generateUserToken(userServices.extractAuthUser(newUser)),
        refreshToken: userServices.generateUserRefreshToken(userServices.extractAuthUser(newUser))
      };
      return res.status(201).json({ status: "success", tokens: tokenResponse, user: newUser });
    }
  } catch (error: any) {
    console.error("Registration/email error:", error);
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        status: "error",
        message: "Registration failed: SMTP authentication error. Please verify your email configuration."
      });
    }
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error"
    });
  }
}

/**
 * Email confirmation endpoint.
 * Confirms the user's email and returns a login token along with both tokens.
 */
export async function confirmEmail(req: Request, res: Response): Promise<Response> {
  try {
    const token = req.query["confirm-token"] as string;
    if (!token) {
      return res.status(400).json({ status: "error", message: "Invalid or missing token." });
    }
    const user = await userServices.findByConfirmationToken(token);
    if (!user) {
      return res.status(400).json({ status: "error", message: "Invalid or expired token." });
    }
    const updatedUser = await userServices.confirmEmail(user.email);
    if (!updatedUser) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }
    const tokenResponse = {
      accessToken: userServices.generateUserToken(userServices.extractAuthUser(updatedUser)),
      refreshToken: userServices.generateUserRefreshToken(userServices.extractAuthUser(updatedUser))
    };
    return res.status(200).json({ status: "success", tokens: tokenResponse, user: updatedUser });
  } catch (error: any) {
    console.error("Email confirmation error:", error);
    return res.status(500).json({ status: "error", message: "Email confirmation failed." });
  }
}

/**
 * Forgot password endpoint.
 * Generates a password reset token and sends a reset email.
 */
export async function forgotPassword(req: Request, res: Response): Promise<Response> {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required." });
    }
    const user = await userServices.findByEmail(email);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    if (!resetToken) {
      return res.status(500).json({ status: "error", message: "Failed to generate password reset token." });
    }
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await userServices.setPasswordResetToken(email, resetToken, resetExpires);
    const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password?password-reset-token=${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Hello ${user.name},</p>
             <p>Please click the following link to reset your password. This link will expire in 1 hour:</p>
             <a href="${resetLink}">${resetLink}</a>`
    });
    return res.status(200).json({ status: "success", message: "Password reset email sent." });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ status: "error", message: "Password reset failed." });
  }
}

/**
 * Reset password endpoint.
 * Resets the user's password and returns a login token along with both tokens.
 */
export async function resetPassword(req: Request, res: Response): Promise<Response> {
  try {
    const { passwordResetToken, newPassword } = req.body;
    if (!passwordResetToken || !newPassword) {
      return res.status(400).json({ status: "error", message: "Token and new password are required." });
    }
    const user = await userServices.findByResetToken(passwordResetToken);
    if (!user) {
      return res.status(400).json({ status: "error", message: "Invalid or expired token." });
    }
    const updatedUser = await userServices.resetPassword(user.email, newPassword);
    if (!updatedUser) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }
    const tokenResponse = {
      accessToken: userServices.generateUserToken(userServices.extractAuthUser(updatedUser)),
      refreshToken: userServices.generateUserRefreshToken(userServices.extractAuthUser(updatedUser))
    };
    return res.status(200).json({ status: "success", tokens: tokenResponse, user: updatedUser });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return res.status(500).json({ status: "error", message: "Reset password failed." });
  }
}

/**
 * Login endpoint.
 * Validates credentials and returns a login token along with user data and both tokens.
 */
export async function login(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ status: "error", message: "Email and password are required" });
    }

    const tokenResponse = await userServices.login(req.body.email, req.body.password);
    if (!tokenResponse) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    // Decode the access token to return user data (if needed)
    const decodedToken = decodeToken(tokenResponse.accessToken);
    return res.json({ status: "success", tokens: tokenResponse, user: decodedToken });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

/**
 * Endpoint to get authenticated user info.
 */
export async function me(req: Request, res: Response): Promise<Response> {
  try {
    let token: string = req.headers.authorization as string;
    if (token.toLowerCase().startsWith('bearer')) {
      token = token.slice('bearer'.length).trim();
    }

    const decodedToken = decodeToken(token);
    if (typeof decodedToken.userId === 'number') {
      const user = await userServices.findMeByUserId(decodedToken.userId.toString());
      if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
      }
      return res.json({ status: "success", user });
    } else {
      return res.status(500).json({ status: "error", message: "Invalid token" });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ status: "error", message: error.message });
  }
}

/**
 * Endpoint to get all users.
 */
export async function getUsers(req: Request, res: Response): Promise<Response> {
  try {
    const users = await userServices.getUsers();
    return users && users.length > 0
      ? res.json({ status: "success", users })
      : res.status(404).json({ status: "error", message: "No users found" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

/**
 * Refresh token endpoint.
 * Receives a refresh token and, if valid, issues a new access token and refresh token.
 */
export async function refreshToken(req: Request, res: Response): Promise<Response> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ status: "error", message: "Refresh token is required" });
    }

    const decoded = await validateRefreshToken(refreshToken);

    // The decoded token should already contain the authentication fields.
    const userForToken = {
      name: decoded.name,
      email: decoded.email,
      userId: decoded.userId,
      accessTypes: decoded.accessTypes || []
    };

    const newAccessToken = userServices.generateUserToken(userForToken);
    const newRefreshToken = userServices.generateUserRefreshToken(userForToken);

    return res.status(200).json({
      status: "success",
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ status: "error", message: "Invalid refresh token", error: error.message });
  }
}
