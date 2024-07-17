import Chat from "./IChat";
import { Document } from "mongoose";

export interface IPicture {
    chat: Chat;
    uploadedBy?: string;
    url?: string;
}

export default interface IPictureDocument extends IPicture, Document {}