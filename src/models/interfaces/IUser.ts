import { Document, Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  nickname?: string;
  pic: string;
  isAdmin: boolean;
}

export default interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId; 
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
