import IMessageDocument from "@src/models/interfaces/IMessage";

import { Schema } from "mongoose";

const MessageSchema = new Schema<IMessageDocument>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    isPic: {type: Boolean, default: false},
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default MessageSchema;