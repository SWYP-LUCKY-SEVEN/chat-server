import { model } from "mongoose";

import IChatDocument from "@src/models/interfaces/IChat";
import ChatSchema from "@src/models/schemas/chatSchema";

const Chat = model<IChatDocument>("Chat", ChatSchema);
export default Chat;
