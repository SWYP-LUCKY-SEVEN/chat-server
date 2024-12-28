import { Document, Types } from "mongoose";
import Chat from "./IChat"

export interface INoti { 
  _id: Types.ObjectId;
  chat: Chat;
  isTop: boolean,
  contents: string,
  messageIdx: number
}

export default interface INotiDocument extends INoti, Document {
  _id: Types.ObjectId;
}