import { Document, Types } from "mongoose";

export interface INoti { 
  _id: Types.ObjectId;
  isTop: boolean,
  contents: string
}