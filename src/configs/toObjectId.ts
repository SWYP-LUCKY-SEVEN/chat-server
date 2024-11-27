import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export function toObjectId(number: any): mongoose.Types.ObjectId {
  // 숫자를 16진수 문자열 및 24자리 문자열로 변환
  const hexString:string = number.toString(16).padStart(24, "0");

  return new ObjectId(hexString);
}