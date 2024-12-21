import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export function toObjectId(number: any): mongoose.Types.ObjectId {
  // 숫자를 10진수 문자열 및 24자리 문자열로 변환
  const hexString:string = number.toString().padStart(24, "0");

  return new ObjectId(hexString);
}


export function toNumber(objectId: mongoose.Types.ObjectId): number {
  // ObjectId 문자열을 숫자로 변환 (10진수 사용)
    return parseInt(objectId.toHexString().replace(/^0+/, ""), 10)
}