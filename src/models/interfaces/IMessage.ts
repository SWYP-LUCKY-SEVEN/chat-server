import { Document } from "mongoose";
import Chat from "./IChat";
import User from "./IUser";

export interface IMessage {
  index: Number;
  sender?: string;
  isPic: boolean;
  content?: string;
  chat: Chat;
  readBy: User;
}

export default interface IMessageDocument extends IMessage, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
