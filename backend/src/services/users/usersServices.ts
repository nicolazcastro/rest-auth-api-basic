import { IUser, INewUserEntry } from '../../models/user';
import bcrypt from 'bcrypt';
import * as db from '../../db/db';
import User from '../../models/user';
import { TokenPayload } from '../../types/types';
import { generateToken } from '../../utils/jwt.utils';
import { AccessTypes, AdminAccessTypes } from '../../models/enums';

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
  // Clear the confirmation token fields upon confirming email.
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

export async function getUsers(): Promise<IUser[] | any> {
  await db.connectDb();
  return User.find().then((entries: IUser[] | null) => {
    if (entries === null) {
      return entries;
    } else {
      const objs: any[] = [];
      for (const element of entries) {
        objs.push(element);
      }
      return objs;
    }
  }).catch((e: any) => {
    console.log(e);
    throw new Error(e);
  });
}

export const getNextUserId = async (): Promise<number | any> => {
  await db.connectDb();
  return User.findOne().sort({ userId: -1 }).limit(1).then((entry: IUser | null) => {
    if (entry == null) {
      return 1;
    } else {
      const obj: Partial<IUser> = {
        userId: entry.userId + 1
      };
      return obj.userId;
    }
  }).catch((e: any) => {
    console.log(e);
    throw new Error(e);
  });
};

export async function login(email: string, password: string): Promise<string | null> {
  try {
    if (email.length > 0 && password.length > 0) {
      await db.connectDb();
      return User.findOne({ email }).then(async (user: IUser | null) => {
        if (!user) {
          return null;
        }
        const passMatch = await bcrypt.compare(password, user.password);
        if (user && passMatch) {
          // Use centralized token generation.
          return generateUserToken(user);
        } else {
          console.log('password invalid for: ' + email);
          return null;
        }
      }).catch((e: any) => {
        console.log('user not found', e);
        throw new Error(e);
      });
    } else {
      console.log('Invalid Data');
      return null;
    }
  } catch (e: any) {
    console.log('error', e.message);
    return null;
  }
}

export async function findByUserId(userId: number): Promise<IUser | any> {
  await db.connectDb();
  return User.findOne({ userId }).then((entry: IUser | null) => entry)
    .catch((e: any) => {
      console.log(e);
      throw new Error(e);
    });
}

export async function findByEmail(email: string): Promise<IUser | any> {
  await db.connectDb();
  return User.findOne({ email }).then((entry: IUser | null) => entry)
    .catch((e: any) => {
      console.log(e);
      throw new Error(e);
    });
}

export async function findMeByUserId(userId: string): Promise<IUser | any> {
  await db.connectDb();
  return User.findOne({ userId }).then((entry: IUser | null) => {
    const obj: Partial<IUser> = {
      userId: entry?.userId,
      name: entry?.name,
      email: entry?.email,
      profile: entry?.profile
    };
    return obj;
  }).catch((e: any) => {
    console.log(e);
    throw new Error(e);
  });
}

export async function findById(id: string): Promise<IUser | any> {
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

/**
 * Centralized function to generate a JWT token for a user.
 */
export function generateUserToken(user: IUser): string {
  let accessTypes: string[] = [];
  if (user.accessTypes && user.accessTypes.length > 0) {
    accessTypes = user.accessTypes;
  } else {
    // If no accessTypes are set, assign defaults based on user profile.
    if (user.profile === 'admin') {
      accessTypes = Object.values(AdminAccessTypes) as any[];
    } else {
      accessTypes = Object.values(AccessTypes) as any[];
    }
  }
  const payload: TokenPayload = {
    name: user.name,
    email: user.email,
    userId: user.userId,
    accessTypes: accessTypes
  };
  return generateToken(payload);
}