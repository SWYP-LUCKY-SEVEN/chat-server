import { Document, Types } from "mongoose";

export interface INoti { 
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  isTop: boolean,
  contents: string,
  messsageIdx: number
}

export default interface INotiDocument extends INoti, Document {
  _id: Types.ObjectId;
}