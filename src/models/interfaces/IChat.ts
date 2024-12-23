import { Document, Types } from "mongoose";
import { IMessage } from "./IMessage";
import User from "./IUser";
import { INoti } from "./INoti";

export interface IJoinDates {
  userId: string,
  joinedDate: Date,
  updatedDate: Date,
  isRemoved: boolean,
}

interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: IMessage;
  messageSeq: number;
  groupAdmin: User;
  isDeleted: boolean
  noti: INoti[]
  topNoti: number | null;
  joinDates: IJoinDates[]
}

export default interface IChatDocument extends IChat, Document {}