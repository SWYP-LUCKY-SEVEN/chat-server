import mongoose from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;

export default interface IMemberDTO {
  _id:ObjectId;
  nickname?: string;
  pic: string;
  isAdmin: boolean;
}