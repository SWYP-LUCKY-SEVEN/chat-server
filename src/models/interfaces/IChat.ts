import { Document } from "mongoose";
import { IMessage } from "./IMessage";
import User from "./IUser";

export interface INoti {
  _id: String;
  isTop: boolean,
  contents: string
}

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
  groupAdmin: User;
  isDeleted: boolean
  noti: INoti[]
  topNoti: number | null;
  joinDates: IJoinDates[]
}

export default interface IChatDocument extends IChat, Document {}