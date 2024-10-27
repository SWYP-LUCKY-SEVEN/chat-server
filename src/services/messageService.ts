import generateToken from "@configs/generateToken";
import Chat from "@src/models/chatModel";
import Message from "@src/models/messageModel";
import User from "@src/models/userModel";
import redisClient from "@src/redis/redis-client"

interface IError extends Error {
  statusCode: number;
}

const TTL_SECONDS = 3 * 24 * 60 * 60; // 3일
const EXPIRY_TIME_THRESHOLD = 3600 * 1000; // 1시간 (밀리초 단위)

const getAllMessages = async (chatId: string) => {
  if (!chatId) {
    const error = new Error("chatId 확인") as IError;
    error.statusCode = 400;
    throw error;
  } else {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "nickname pic email");

    const chat = await Chat.findById(chatId, { noti:0 });
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
const getRecentMessages = async (chatId: string, page:number, limit: number) => {
  if (!chatId) {
    const error = new Error("chatId 확인") as IError;
    error.statusCode = 400;
    throw error;
  }
  const messages = await redisClient.lRange(`room:${chatId}`, 0, -1);

  let resultMessages = await Message.find({ chat: chatId })
    .sort({ timestamp: -1 })
    .skip(page*limit)
    .limit(limit)
    .populate("sender", "nickname pic email");

  const chat = await Chat.findById(chatId, { noti:0 });
  const data = {
    chat : chat,
    messages : resultMessages
  }

  if (resultMessages && chat) return data;
  else {
    const error = new Error("메시지 조회 실패") as IError;
    error.statusCode = 404;
    throw error;
  }  
};


const sendMessage = async (
  content: string,
  chatId: string,
  reqUserId: string
) => {
  if (!content || !chatId) {
    const error = new Error("유효하지 않은 요청") as IError;
    error.statusCode = 400;
    throw error;
  }

  // seq는 실제로 메세지가 생성되지 않았더라도, 증가 해도 됨.
  const chatRoom = await Chat.findByIdAndUpdate(
    chatId,
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
    sender: reqUserId,
    content,
    chat: chatId,
  };

  let message:any = await Message.create(newMessage);
  message = await message.populate("sender", "nickname pic");

  if (message) {
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    return message;
  } else {
    const error = new Error("메시지 전송에 실패") as IError;
    error.statusCode = 500;
    throw error;
  }
};

const findMessageText = async (
  findText: string,
  chatId: string,
  LoadStartIndex: Number
) => {
  if (!findText || !chatId) {
    const error = new Error("유효하지 않은 요청") as IError;
    error.statusCode = 400;
    throw error;
  }
  
  const message = await Message.find(
    { 
      content:findText 
    }
  )

}

const sendPicture = async (
  content: string,
  chatId: string,
  reqUserId: string
) => {
  if (!content || !chatId) {
    const error = new Error("유효하지 않은 요청") as IError;
    error.statusCode = 400;
    throw error;
  }

  const newMessage = {
    sender: reqUserId,
    isPic:true,
    content,
    chat: chatId,
  };
  let message = await Message.create(newMessage);
  
  if (message) {
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
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
};
