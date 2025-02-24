import { IUser, INewUserEntry } from '../../models/user';
import bcrypt from 'bcrypt';
import * as db from '../../db/db';
import User from '../../models/user';
import { TokenPayload, IAuthUser, TokenResponse } from '../../types/authTypes';
import { generateToken, generateRefreshToken } from '../../utils/jwt.utils';
import { AccessTypes, AdminAccessTypes } from '../../models/enums';

/**
 * Registers a new user.
 * @param parsedUserEntry - The new user entry data.
 * @returns The saved user.
 */
export async function register(parsedUserEntry: INewUserEntry): Promise<IUser> {
  await db.connectDb();
  const salt = await bcrypt.genSalt(6);
  const hashedPassword = await bcrypt.hash(parsedUserEntry.password, salt);
  const newUserEntry = new User({
    name: parsedUserEntry.name,
    email: parsedUserEntry.email,
    userId: parsedUserEntry.userId,
    password: hashedPassword,
    profile: parsedUserEntry.profile,
    emailConfirmed: parsedUserEntry.emailConfirmed,
    emailConfirmationToken: parsedUserEntry.emailConfirmationToken,
    emailConfirmationExpires: parsedUserEntry.emailConfirmationExpires,
    accessTypes: parsedUserEntry.accessTypes || []
  });
  console.log("newUserEntry", newUserEntry);
  return newUserEntry.save().then(() => newUserEntry);
}

export async function confirmEmail(email: string): Promise<IUser | null> {
  await db.connectDb();
  return User.findOneAndUpdate(
    { email },
    { emailConfirmed: true, emailConfirmationToken: undefined, emailConfirmationExpires: undefined },
    { new: true }
  );
}

export async function findByConfirmationToken(token: string): Promise<IUser | null> {
  await db.connectDb();
  return User.findOne({
    emailConfirmationToken: token,
    emailConfirmationExpires: { $gt: new Date() }
  });
}

export async function setPasswordResetToken(email: string, token: string, expires: Date): Promise<IUser | null> {
  await db.connectDb();
  return User.findOneAndUpdate(
    { email },
    { passwordResetToken: token, passwordResetExpires: expires },
    { new: true }
  );
}

export async function findByResetToken(token: string): Promise<IUser | null> {
  await db.connectDb();
  return User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() }
  });
}

export async function resetPassword(email: string, newPassword: string): Promise<IUser | null> {
  await db.connectDb();
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  return User.findOneAndUpdate(
    { email },
    { password: hashedPassword, passwordResetToken: undefined, passwordResetExpires: undefined },
    { new: true }
  );
}

export async function getUsers(): Promise<IUser[]> {
  await db.connectDb();
  return User.find().then((entries: IUser[] | null) => {
    return entries || [];
  }).catch((e: any) => {
    console.log(e);
    throw new Error(e);
  });
}

export const getNextUserId = async (): Promise<number> => {
  await db.connectDb();
  return User.findOne().sort({ userId: -1 }).limit(1).then((entry: IUser | null) => {
    return entry == null ? 1 : entry.userId + 1;
  }).catch((e: any) => {
    console.log(e);
    throw new Error(e);
  });
};

/**
 * Extracts the authentication-relevant fields from a full IUser object.
 * @param user - The full user model.
 * @returns An object conforming to IAuthUser.
 */
export function extractAuthUser(user: IUser): IAuthUser {
  return {
    name: user.name,
    email: user.email,
    userId: user.userId,
    accessTypes: (user.accessTypes && user.accessTypes.length > 0)
      ? user.accessTypes
      : (user.profile === 'admin'
          ? Object.values(AdminAccessTypes) as string[]
          : Object.values(AccessTypes) as string[])
  };
}

/**
 * Generates a JWT access token for a user.
 * @param authUser - The authentication user data.
 * @returns A signed access token as a string.
 */
export function generateUserToken(authUser: IAuthUser): string {
  const payload: TokenPayload = {
    name: authUser.name,
    email: authUser.email,
    userId: authUser.userId,
    accessTypes: authUser.accessTypes
  };
  return generateToken(payload);
}

/**
 * Generates a JWT refresh token for a user.
 * @param authUser - The authentication user data.
 * @returns A signed refresh token as a string.
 */
export function generateUserRefreshToken(authUser: IAuthUser): string {
  const payload: TokenPayload = {
    name: authUser.name,
    email: authUser.email,
    userId: authUser.userId,
    accessTypes: authUser.accessTypes
  };
  return generateRefreshToken(payload);
}

/**
 * Logs in a user by verifying credentials and returning both tokens.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns An object containing the access and refresh tokens, or null if invalid.
 */
export async function login(email: string, password: string): Promise<TokenResponse | null> {
  try {
    if (email.length > 0 && password.length > 0) {
      await db.connectDb();
      return User.findOne({ email }).then(async (user: IUser | null) => {
        if (!user) {
          return null;
        }
        const passMatch = await bcrypt.compare(password, user.password);
        if (user && passMatch) {
          const authUser = extractAuthUser(user);
          const accessToken = generateUserToken(authUser);
          const refreshToken = generateUserRefreshToken(authUser);
          return { accessToken, refreshToken };
        } else {
          console.log('Password invalid for: ' + email);
          return null;
        }
      }).catch((e: any) => {
        console.log('User not found', e);
        throw new Error(e);
      });
    } else {
      console.log('Invalid data');
      return null;
    }
  } catch (e: any) {
    console.log('Error', e.message);
    return null;
  }
}

export async function findByUserId(userId: number): Promise<IUser | null> {
  await db.connectDb();
  return User.findOne({ userId }).then((entry: IUser | null) => entry)
    .catch((e: any) => {
      console.log(e);
      throw new Error(e);
    });
}

export async function findByEmail(email: string): Promise<IUser | null> {
  await db.connectDb();
  return User.findOne({ email }).then((entry: IUser | null) => entry)
    .catch((e: any) => {
      console.log(e);
      throw new Error(e);
    });
}

export async function findMeByUserId(userId: string): Promise<Partial<IUser>> {
  await db.connectDb();
  return User.findOne({ userId }).then((entry: IUser | null) => {
    if (entry) {
      return {
        userId: entry.userId,
        name: entry.name,
        email: entry.email,
        profile: entry.profile
      };
    }
    return {};
  }).catch((e: any) => {
    console.log(e);
    throw new Error(e);
  });
}

export async function findById(id: string): Promise<IUser | null> {
  await db.connectDb();
  return User.findById(id).then((entry: IUser | null) => entry)
    .catch((e: any) => {
      console.log(e);
      throw new Error(e);
    });
}

export async function setUserPassword(id: string, pass: string): Promise<void> {
  await User.findByIdAndUpdate(id, { password: pass });
}
