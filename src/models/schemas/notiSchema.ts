import { Schema, model } from "mongoose";

import { INoti } from "@src/models/interfaces/IChat";

const NotiSchema = new Schema<INoti>(
    {
      _id: { type: String, required: true, unique: true },
      isTop: { type: Boolean, default: false },
      contents: { type: String, required: true }
    },
    { timestamps: true }
  );
  
  export default NotiSchema;