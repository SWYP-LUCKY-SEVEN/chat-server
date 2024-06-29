import mongoose, { Schema } from "mongoose";

import IMessageDocument from "@src/dtos/messageDto";

const messageSchema = new Schema<IMessageDocument>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
