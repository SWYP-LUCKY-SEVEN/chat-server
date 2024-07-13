import { ObjectId } from "mongoose";

export default interface IUserDTO {
  _id:ObjectId;
  nickname?: string;
  pic: string;
  isAdmin: boolean;
}