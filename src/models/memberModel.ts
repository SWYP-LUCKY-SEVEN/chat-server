import { model } from "mongoose";

import IMemberDocument from "@src/models/interfaces/IMember";
import MemberSchema from "./schemas/memberSchema";

const Member = model<IMemberDocument>("Member", MemberSchema);
export default Member;
