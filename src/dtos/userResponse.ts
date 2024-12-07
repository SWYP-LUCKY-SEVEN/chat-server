import { toNumber } from "@src/configs/utill";
import IUserDTO from "./userDto";

export default interface IUserResponse {
  _id:number;
  nickname?: string;
  pic: string;
  isAdmin: boolean;
}


export function getUserWithNumberId(user: IUserDTO): IUserResponse {
    return {
        _id:toNumber(user._id),
        nickname: user.nickname,
        pic: user.pic,
        isAdmin: user.isAdmin
    };
}