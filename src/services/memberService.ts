import generateToken from "@configs/generateToken";
import Member from "@src/models/memberModel";

interface IError extends Error {
  statusCode: number;
}

const signUpMember = async (
  nickname: string,
  email: string,
  password: string,
  pic: string
) => {
  if (!nickname || !email || !password) {
    const error = new Error("필드 확인") as IError;
    error.statusCode = 400;
    throw error;
  }

  const nemberExists = await Member.findOne({ email });

  if (nemberExists) {
    const error = new Error("멤버 존재") as IError;
    error.statusCode = 409;
    throw error;
  }

  const nember = await Member.create({
    nickname,
    email,
    password,
    pic,
  });

  if (nember) {
    return {
      _id: nember._id,
      nickname: nember.nickname,
      isAdmin: nember.isAdmin,
      pic: nember.pic,
      token: generateToken(nember._id),
    };
  } else {
    const error = new Error("멤버 생성 안됌") as IError;
    error.statusCode = 404;
    throw error;
  }
};

const signInMember = async (nickname: string) => {
  const nember = await Member.findOne({ nickname: nickname });
  if (nember) {
    return {
      _id: nember._id,
      nickname: nember.nickname,
      isAdmin: nember.isAdmin,
      pic: nember.pic,
      token: generateToken(nember._id),
    };
  } else {
    const error = new Error("멤버 없음") as IError;
    error.statusCode = 404;
    throw error;
  }
};
const getMembers = async (keyword: any, memberId: string) => {
  let filter = {};
  keyword
    ? (filter = {
        $or: [
          { nickname: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      })
    : (filter = {});
  const nembers = await Member.find(filter).find({ _id: { $ne: memberId } });
  if (nembers) {
    return nembers;
  } else {
    const error = new Error("발견된 멤버 없음") as IError;
    error.statusCode = 404;
    throw error;
  }
};
const getMember = async (memberId: any) => {
  const nember = await Member.findOne({_id: memberId});
  if (nember) {
    return nember;
  } else {
    const error = new Error("발견된 멤버 없음") as IError;
    error.statusCode = 404;
    throw error;
  }
};

export default { signUpMember, signInMember, getMembers, getMember };

