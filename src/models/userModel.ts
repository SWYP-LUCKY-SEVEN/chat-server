import { model } from "mongoose";

import IUserDocument from "@src/models/interfaces/IUser";
import UserSchema from "./schemas/userSchema";

const User = model<IUserDocument>("User", UserSchema);
export default User;
