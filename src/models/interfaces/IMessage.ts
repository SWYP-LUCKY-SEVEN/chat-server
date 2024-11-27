import { Document } from "mongoose";
import Chat from "./IChat";
import Member from "./IMember";

export interface IMessage {
  index: Number;
  sender?: string;
  isPic: boolean;
  content?: string;
  chat: Chat;
  readBy: Member;
}

export default interface IMessageDocument extends IMessage, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
