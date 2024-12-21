import { Schema, model } from "mongoose";
import { INoti } from "../interfaces/INoti";

const NotiSchema = new Schema<INoti>(
    {
      isTop: { type: Boolean, default: false },
      contents: { type: String, required: true }
    },
    { timestamps: true }
  );
  
  export default NotiSchema;