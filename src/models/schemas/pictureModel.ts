import IPictureDocument from "@src/models/interfaces/IPicture";

import { Schema } from "mongoose";

const PictureSchema = new Schema<IPictureDocument>(
    {
      chat: { type: Schema.Types.ObjectId, ref: "Chat" },
      uploadedBy: { type: Schema.Types.ObjectId, ref: "Member" },
      url: { type: String, trim: true },
    },
    { timestamps: true }
);

export default PictureSchema;