import { Document } from "mongoose";

export interface IPicture {
    url: string;
    publisher: string;
}

export default interface IPictureDocument extends IPicture, Document {}