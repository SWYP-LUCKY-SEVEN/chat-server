import { Schema } from "mongoose";

import IMemberDocument from "@src/models/interfaces/IMember";
import bcrypt from "bcrypt";

const MemberSchema = new Schema<IMemberDocument>(
  {
    nickname: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

MemberSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default MemberSchema