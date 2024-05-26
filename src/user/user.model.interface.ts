import {Document, Model} from 'mongoose';

export interface User {
  login: string;
  password: string;
  salt: string;
  token?: string;
}

export interface UserDocument extends User, Document {
  comparePassword(password: string): boolean;
}

export type UserModel = Model<UserDocument>;
