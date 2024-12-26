import { Schema, model } from "mongoose";
import INotiDocument from "../interfaces/INoti";

const NotiSchema = new Schema<INotiDocument>(
    {
      chatId: { type: Schema.Types.ObjectId, required: true },
      isTop: { type: Boolean, default: false },
      contents: { type: String, required: true },
      messsageIdx: { type: Number, required: false }
    },
    { timestamps: true }
  );
  
  export default NotiSchema;