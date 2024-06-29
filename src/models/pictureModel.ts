import { Schema, model } from "mongoose";

import IPictureDocument from "@src/dtos/pictureDto";

const pictureSchema = new Schema<IPictureDocument>(
    {
      chat: { type: Schema.Types.ObjectId, ref: "Chat" },
      uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
      url: { type: String, trim: true },
    },
    { timestamps: true }
  );
  
const Picture = model("Picture", pictureSchema);
export default Picture;