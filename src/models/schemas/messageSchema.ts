import IMessageDocument from "@src/models/interfaces/IMessage";

import { Schema } from "mongoose";

const MessageSchema = new Schema<IMessageDocument>(
  {
    index: { type: Number },
    sender: { type: Schema.Types.ObjectId, ref: "Member" },
    isPic: {type: Boolean, default: false},
    content: { type: String, trim: true },
    chat: {
       type: Schema.Types.ObjectId, 
       index: true,
       ref: "Chat" 
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Member" }],
  },
  { timestamps: true }
);

export default MessageSchema;