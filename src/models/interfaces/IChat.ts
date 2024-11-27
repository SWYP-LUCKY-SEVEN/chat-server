import { Document, Types } from "mongoose";
import { IMessage } from "./IMessage";
import Member from "./IMember";
import { ICustomSocket } from '@src/types/socket/ICustomSocket';

export interface INoti { 
  _id: Types.ObjectId;
  isTop: boolean,
  contents: string
}

export interface IJoinDates {
  memberId: string,
  joinedDate: Date,
  updatedDate: Date,
  isRemoved: boolean,
}

interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: Member[];
  latestMessage: IMessage;
  messageSeq: number;
  groupAdmin: Member;
  isDeleted: boolean
  noti: INoti[]
  topNoti: number | null;
  joinDates: IJoinDates[]
}

export default interface IChatDocument extends IChat, Document {}