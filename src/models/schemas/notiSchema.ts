import { Schema, model } from "mongoose";
import INotiDocument from "../interfaces/INoti";

const NotiSchema = new Schema<INotiDocument>(
    {
      chat: { 
        type: Schema.Types.ObjectId,
        index: true,
        ref: "Chat" 
      },
      isTop: { type: Boolean, default: false },
      contents: { type: String, required: true },
      messageIdx: { type: Number, required: false }
    },
    { timestamps: true }
  );
  
  export default NotiSchema;