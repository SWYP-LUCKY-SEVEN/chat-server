import { Schema } from "mongoose";

import IUserDocument from "@src/models/interfaces/IUser";
import bcrypt from "bcrypt";

const UserSchema = new Schema<IUserDocument>(
  {
    _id: { type: Schema.Types.ObjectId }, // required: true 는 디폴트
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

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default UserSchema