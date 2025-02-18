import * as userServices from '../services/users/usersServices';
import { Request, Response } from 'express';
import { decodeToken, generateToken } from '../utils/jwt.utils';
import { validateUserData } from '../utils/validation';
import { AccessTypes, AdminAccessTypes } from '../models/enums';

/**
 * Handles user registration with validation.
 * If registration is successful, a token is generated and returned along with the user data.
 */
export async function register(req: Request, res: Response): Promise<Response> {
  try {
    // Validate the request data
    const validation = validateUserData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ status: "error", errors: validation.errors });
    }

    const existingUser = await userServices.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).json({ status: "error", message: "Email already in use" });
    }

    req.body.userId = await userServices.getNextUserId();

    // Register the new user
    const newUser = await userServices.register(req.body);

    // Determine access types based on the user's profile.
    // Since the enums are numeric enums, we extract only the string keys.
    let accessTypes: string[] = [];
    if (newUser.profile === 'admin') {
      accessTypes = Object.keys(AdminAccessTypes).filter(key => isNaN(Number(key)));
    } else {
      accessTypes = Object.keys(AccessTypes).filter(key => isNaN(Number(key)));
    }

    // Create the token payload
    const tokenPayload = {
      name: newUser.name,
      email: newUser.email,
      userId: newUser.userId,
      accessTypes
    };

    // Generate the token using the generateToken utility
    const token = generateToken(tokenPayload);

    // Return the response with token and user data
    return res.status(201).json({ status: "success", token, user: tokenPayload });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

/**
 * Handles user login with validation.
 */
export async function login(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ status: "error", message: "Email and password are required" });
    }

    const token = await userServices.login(req.body.email, req.body.password);
    if (!token) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const decodedToken = decodeToken(token);
    return res.json({ status: "success", token, user: decodedToken });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

/**
 * Handles fetching authenticated user information.
 */
export async function me(req: Request, res: Response): Promise<Response> {
  try {
    let token: string = req.headers.authorization as string;
    if (token.toLowerCase().startsWith('bearer')) {
      token = token.slice('bearer'.length).trim();
    }

    const decodedToken = decodeToken(token);
    if (typeof decodedToken.userId === 'number') {
      const user = await userServices.findMeByUserId(decodedToken.userId);
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
 * Fetch all users.
 */
export async function getUsers(_req: Request, res: Response): Promise<Response> {
  try {
    const users = await userServices.getUsers();
    return users ? res.json({ status: "success", users }) : res.status(404).json({ status: "error", message: "No users found" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
