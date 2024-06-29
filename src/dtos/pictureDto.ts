import Chat from "./chatDto";
import { Document } from "mongoose";
import User from "./userDto";

export interface IPicture {
    chat: Chat;
    uploadedBy?: string;
    url?: string;
}

export default interface IPictureDocument extends IPicture, Document {}