import { default as IChatDocument } from "@src/models/interfaces/IChat";
import NotiSchema from "@src/models/schemas/notiSchema";

import { Schema } from "mongoose";

const ChatSchema = new Schema<IChatDocument>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    messageSeq: { type: Number, default: 0 },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: {
      type: Schema.Types.Boolean,
      index: true,
      default: false
    },
    noti: {
      type: [NotiSchema],
      default: [], 
    },
    topNoti: { type: Number, default: null },
    joinDates: {
      type: Schema.Types.Mixed,
      default: []
    }
  },
  { timestamps: true }
);

export default ChatSchema;