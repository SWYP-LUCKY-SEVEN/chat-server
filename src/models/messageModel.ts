import { model } from "mongoose";

import IMessageDocument from "./interfaces/IMessage";
import MessageSchema from "@src/models/schemas/messageSchema"

const Message = model<IMessageDocument>("Message", MessageSchema);

export default Message;
