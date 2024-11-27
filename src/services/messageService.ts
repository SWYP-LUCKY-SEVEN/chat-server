import generateToken from "@configs/generateToken";
import { toObjectHexString } from "@src/configs/toObjectId";
import Chat from "@src/models/chatModel";
import Message from "@src/models/messageModel";
import User from "@src/models/userModel";
import redisClient from "@src/redis/redis-client"

interface IError extends Error {
  statusCode: number;
}

const TTL_SECONDS = 3 * 24 * 60 * 60; // 3일
const EXPIRY_TIME_THRESHOLD = 3600 * 1000; // 1시간 (밀리초 단위)

const getAllMessages = async (chatObjectId: string) => {
  if (!chatObjectId) {
    const error = new Error("chatId 확인") as IError;
    error.statusCode = 400;
    throw error;
  } else {
    const messages = await Message.find({ chat: chatObjectId })
      .populate("sender", "nickname pic email");

    const chat = await Chat.findById( chatObjectId, { noti:0 });
    const data = {
      chat : chat,
      messages : messages
    }

    if (messages && chat) return data;
    else {
      const error = new Error("메시지 조회 실패") as IError;
      error.statusCode = 404;
      throw error;
    }
  }
};

// 최신 메세지 redis 사용 안할 듯 함.
const getRecentMessages = async (chatObjectId: string, page:number, limit: number) => {
  if (!chatObjectId) {
    const error = new Error("chatId 확인") as IError;
    error.statusCode = 400;
    throw error;
  }
  let messages = await Message.find({ chat: chatObjectId })
    .sort({ index : -1 }) // index == 메세지 순서
    .skip(page*limit)
    .limit(limit)
    .populate("sender", "nickname pic email");

  const chat = await Chat.findById(chatObjectId, { noti:0 });
  const data = {
    chat : chat,
    messages : messages
  }

  if (messages && chat) return data;
  else {
    const error = new Error("메시지 조회 실패") as IError;
    error.statusCode = 404;
    throw error;
  }  
};

const sendMessage = async (
  content: string,
  chatObjectId: string,
  reqUserObjectId: string
) => {
  if (!content || !chatObjectId) {
    const error = new Error("유효하지 않은 요청") as IError;
    error.statusCode = 400;
    throw error;
  }
  // seq는 실제로 메세지가 생성되지 않았더라도, 증가 해도 됨.
  const chatRoom = await Chat.findByIdAndUpdate(
    chatObjectId,
    {
      $inc: { messageSeq: 1 }, // messageSeq 필드를 1 증가
    },
    {
      new: true, // 업데이트 후의 새로운 데이터를 반환
    }
  );  

  if (chatRoom == null) {
    const error = new Error("존재하지 않는 채팅") as IError;
    error.statusCode = 404;
    throw error;
  }

  const newMessage = {
    index: chatRoom.messageSeq,
    sender: reqUserObjectId,
    content,
    chat: chatObjectId,
  };

  let message:any = await Message.create(newMessage);
  message = await message.populate("sender", "nickname pic");

  if (message) {
    await Chat.findByIdAndUpdate(chatObjectId, { latestMessage: message });
    return message;
  } else {
    const error = new Error("메시지 전송에 실패") as IError;
    error.statusCode = 500;
    throw error;
  }
};

const findMessagesByContent  = async (
  chatObjectId: string,
  findText: string
) => {
  if (!findText || !chatObjectId) {
    const error = new Error("유효하지 않은 요청") as IError;
    error.statusCode = 400; 
    throw error;
  }

  // 검색된 채팅 index List 추출
  const messageIndexes = await Message.find(
    {
      chat: chatObjectId,
      content: { $regex: findText, $options: "i" } // 대소문자 구분 없이 검색
    },
    { index: 1, _id: 0 } // _id는 디폴트라 언급해서 제외 필요.
  );
  
  const indexList = messageIndexes.map(message => message.index);

  if (!indexList || indexList.length === 0) {
    const error = new Error("찾는 메세지가 없습니다.") as IError;
    error.statusCode = 404; 
    throw error;
  }

  return indexList;
}


const findMessagesBetweenIndex = async (
  chatObjectId : string,
  startIndex : number,
  targetIndex : number
) => {
  if (!chatObjectId || targetIndex == null) {
    const error = new Error("유효하지 않은 요청") as IError;
    error.statusCode = 400;
    throw error;
  }
  if (startIndex <= targetIndex) {
    const error = new Error("찾는 index가 이미 현재 보유한 데이터에 존재합니다.") as IError;
    error.statusCode = 400;
    throw error;
  }

  // TODO 검증 필요

  const messages = await Message.find({
    chat: chatObjectId,
    index: { $lte: startIndex, $gte: targetIndex } // startIndex 이하, targetIndex 이상
  })
  .sort({ index: -1 }) // 내림차순 (최근 메세지가 앞으로)
  .populate("sender", "nickname pic");

  return messages;
}


const sendPicture = async (
  content: string,
  chatObjectId: string,
  reqUserObjectId: string
) => {
  if (!content || !chatObjectId) {
    const error = new Error("유효하지 않은 요청") as IError;
    error.statusCode = 400;
    throw error;
  }

  const newMessage = {
    sender: reqUserObjectId,
    isPic:true,
    content,
    chat: chatObjectId,
  };
  let message = await Message.create(newMessage);
  
  if (message) {
    await Chat.findByIdAndUpdate(chatObjectId, { latestMessage: message });
    return message;
  } else {
    const error = new Error("메시지 전송에 실패") as IError;
    error.statusCode = 500;
    throw error;
  }
};

export default {
  getAllMessages,
  getRecentMessages,
  sendMessage,
  findMessagesByContent,
  findMessagesBetweenIndex
};
