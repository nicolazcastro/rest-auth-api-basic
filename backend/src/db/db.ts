import dotenv from 'dotenv';
import { connect, disconnect, Types, connection } from 'mongoose';
import User from '../models/user'; // Import the default export

dotenv.config();
const DB_URL: string = process.env.DB_URL as string;
const DB_NAME: string = process.env.DB_NAME as string;

export async function connectDb(): Promise<void> {
  await connect(`${DB_URL}/${DB_NAME}`);
}

export async function disconnectDb(): Promise<void> {
  await disconnect();
}

export function getUserModel(): typeof User {
  return User;
}

export function getNewObjectId(): any {
  return new Types.ObjectId();
}

export async function collectionExist(collName: string): Promise<boolean> {
  await connectDb();
  const coll = connection.db.listCollections({ name: collName });
  const collinfo = await coll.next();
  return collinfo != null;
}