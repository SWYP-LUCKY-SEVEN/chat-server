import { Document } from "mongoose";

interface IMember {
  nickname?: string;
  pic: string;
  isAdmin: boolean;
}

export default interface IMemberDocument extends IMember, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
