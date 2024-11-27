import { userService } from "@services/index";
import { toObjectId } from "@src/configs/toObjectId";
import Chat from "@src/models/chatModel";
import Member from "@src/models/memberModel";
import { randomUUID } from "crypto";
import mongoose from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;

interface IError extends Error {
  statusCode: number;
}

// 유저가 속해있는 채팅방인지 검증
const isRoomAuth = async (chatId: ObjectId, memberId: ObjectId) => {
  const chatObjectId = toObjectId(chatId);

  const chat = await Chat.findById(chatObjectId).populate("users", "_id");

  if (!chat) {
    const error = new Error("존재하지 않는 채팅방입니다.") as IError;
    error.statusCode = 400;
    throw error;
  }

  const userObjectId = toObjectId(memberId);
  
  if (!chat.users.some(user => user._id.toString() === userObjectId)) { //id가 동일한 멤버가 있는지 확인.
    const error = new Error("접근 권한이 없습니다.") as IError;
    error.statusCode = 400;
    throw error;
  }
}

// TODO studyId는 => chatId(ObjectId)로 변환해야함.
const getChat = async (chatId: ObjectId, memberId: ObjectId) => {
  if (!chatId) {
    const error = new Error("studyId 필수") as IError;
    error.statusCode = 400;
    throw error;
  }

  const _id = toObjectId(chatId)
  const isChat = await Chat.find({
    _id,
    isDeleted: false,
    $and: [
      { users: { $elemMatch: { $eq: memberId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  if (isChat.length == 0) {
    return []
  }

  const resultChat = await Member.populate(isChat, {
    path: "latestMessages.sender",
    select: "name pic email",
  });
  if (resultChat && resultChat?.length > 0) {
    return isChat[0];
  }
};

// const getAccessChat = async (userId: string, reqUseId: string) => {
//   if (!userId) {
//     const error = new Error("없는 유저 id") as IError;
//     error.statusCode = 400;
//     throw error;
//   }

//   const isChat = await Chat.find({
//     isGroupChat: false,
//     $and: [
//       { users: { $elemMatch: { $eq: reqUseId } } },
//       { users: { $elemMatch: { $eq: memberId } } },
//     ],
//   })
//     .populate("users", "-password")
//     .populate("latestMessage");

//   const resultChat = await Member.populate(isChat, {
//     path: "latestMessage.sender",
//     select: "name pic email",
//   });

//   if (resultChat && resultChat?.length > 0) {
//     return isChat[0];
//   } else {
//     const createdChat = await Chat.create({
//       chatName: "sender",
//       isGroupChat: false,
//       users: [reqUseId, memberId],
//     });
//     if (!createdChat) {
//       const error = new Error("1:1 채팅 생성 실패") as IError;
//       error.statusCode = 400;
//       throw error;
//     }
//     const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
//       "users",
//       "-password"
//     );
//     if (FullChat) return FullChat;
//     else {
//       const error = new Error("1:1 채팅 조회 실패") as IError;
//       error.statusCode = 404;
//       throw error;
//     }
//   }
// };



// const fetchChats = async (reqUseId: string) => {
//   const chats = await Chat.find({
//     $or: [
//       // { users: { $elemMatch: { $eq: reqUseId } } },
//       { users: reqUseId }
//     ]
//   })
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password")
//     .populate("latestMessage");

//   const resultChat = await Member.populate(chats, {
//     path: "latestMessage.sender",
//     select: "nickname pic email",
//   });

//   if (resultChat) return resultChat;
//   else {
//     const error = new Error("1:1 채팅 조회 실패") as IError;
//     error.statusCode = 404;
//     throw error;
//   }
// };

const createGroupChat = async (memberId: ObjectId, chatId: ObjectId, name: string) => {
  const existUser = await userService.getUser(memberId)
  if(!existUser) {
    const error = new Error("유저 존재하지 않음") as IError;
    error.statusCode = 403;
    throw error;
  }

  const existChat = await Chat.findOne({
    _id: chatId
  })
  console.log(existUser, existChat)

  if(existChat) {
    const error = new Error("이미 존재하는 채팅방") as IError;
    error.statusCode = 403;
    throw error;
  }

  const createdChat = await Chat.create({
    _id: chatId,
    chatName: name,
    messageSeq: 0,
    users: memberId,
    isGroupChat: true,
    groupAdmin: memberId,
  });
  if (!createdChat) {
    const error = new Error("그륩 채팅 생성 실패") as IError;
    error.statusCode = 400;
    throw error;
  }

  if (createdChat) return createdChat;
  else {
    const error = new Error("그륩 채팅 조회 실패") as IError;
    error.statusCode = 404;
    throw error;
  }
};

const updateGroupChat = async (chatId: ObjectId, chatName: string) => { 
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  ).where({ isGroupChat: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    const error = new Error("그륩 채팅 조회 실패") as IError;
    error.statusCode = 404;
    throw error;
  } else {
    return updatedChat;
  }
}

const addToGroup = async (chatId: ObjectId, memberId: ObjectId, reqMemberId?: ObjectId) => { 
  const user = await userService.getUser(memberId)
  if (!user) {
    const error = new Error("유저가 존재하지 않음") as IError;
    error.statusCode = 404;
    throw error; 
  }

  const addedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: memberId },
      },
      {
        new: true,
      }
  )
    .where({ users: {
                $ne : memberId
        }})
    .where({ isGroupChat: true })
    .where( reqMemberId ? { groupAdmin: reqMemberId  } : {})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    
    if (!addedChat) {
      const error = new Error("그륩 채팅 조회 실패 또는 이미 초대된 유저") as IError;
      error.statusCode = 404;
      throw error;
    } else {
      return addedChat;
    }
}

const removeFromGroup = async (chatId: ObjectId, reqMemberId: ObjectId, memberId: ObjectId) => { 
  const isAddedUserChat = await Chat.findOne({ _id: chatId, groupAdmin: reqMemberId, isGroupChat: true, users: memberId });

  if (!isAddedUserChat) {
    const error = new Error("해당 채팅방 없거나 방장 아닌 유저 또는 해당 방에 유저없음") as IError;
    error.statusCode = 409;
    throw error; 
  } else {
    const deletedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: memberId },
      },
      {
        new: true,
      }
    ).where({ isGroupChat: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
      if (!deletedChat) {
        const error = new Error("그륩 채팅 조회 실패") as IError;
        error.statusCode = 404;
        throw error;
      } else {
        if (deletedChat?.users.length == 0) {
          const res = await Chat.updateOne({ _id: chatId }, { $set: { isDeleted: true } });
        }
      return deletedChat;
    }
  }
}
const deleteChat = async (chatId: ObjectId, memberId: ObjectId) => {
  const isChat = await Chat.findOne({ groupAdmin: memberId, isGroupChat: true });
  
  if (!isChat) {
    const error = new Error("방장 아님") as IError;
    error.statusCode = 409;
    throw error;
  } else {
    const deletedChat = await Chat.updateOne({ _id: chatId }, { $set: { isDeleted: true } });
    if (!deletedChat) {
      const error = new Error("채팅 조회 삭제실패") as IError;
      error.statusCode = 500;
      throw error;
    }
    return deletedChat;
  }
}


// 채팅에 참가 여부 활성화하고,
// 채팅방 입장, 나갔음 표시를 위해 존재.
const recordUserJoin = async (chatId: ObjectId, memberId: ObjectId) => {
  const isChat = await Chat.findOne({ _id: chatId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 없음") as IError;
    error.statusCode = 409;
    throw error;
  }

  const joinDateUser = isChat.joinDates.find((x) => 
    new mongoose.Types.ObjectId(x.memberId).equals(memberId)  // 전역으로 설정한 ObjectId는 Type. 값으로 사용은 이처럼 직접 불러와야함
  );

  if (!joinDateUser || joinDateUser.isRemoved) {
    const error = new Error("사용자가 그룹에 가입되어 있지 않음") as IError;
    error.statusCode = 403; // Forbidden
    throw error;
  }

  // 접근 기록 업데이트
  const updatedChat = await Chat.findOneAndUpdate(
    { _id: chatId, "joinDates.userId": memberId },
    {
      $set: { 
        "joinDates.$.updatedDate": new Date(),
      },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");

  if (!updatedChat) {
    const error = new Error("접근 기록 업데이트 실패") as IError;
    error.statusCode = 500; // Internal Server Error
    throw error;
  }

  return updatedChat;
};



// 채팅에 참가 여부 활성화하고,
// 채팅방 입장, 나갔음 표시를 위해 존재.
const recordUserOut = async (chatId: ObjectId, memberId: ObjectId) => {
  // 채팅방 존재 여부 확인
  const isChat = await Chat.findOne({ _id: chatId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 없음") as IError;
    error.statusCode = 409; // Conflict
    throw error;
  }

  // 사용자 가입 상태 확인
  const joinDateUser = isChat.joinDates.find((x) =>
    new mongoose.Types.ObjectId(x.memberId).equals(memberId)  // 전역으로 설정한 ObjectId는 Type. 값으로 사용은 이처럼 직접 불러와야함
  );

  if (!joinDateUser) {
    const error = new Error("사용자가 그룹에 존재하지 않음") as IError;
    error.statusCode = 404; // Not Found
    throw error;
  }

  // 사용자 제거 (isRemoved: true로 설정)
  const updatedChat = await Chat.findOneAndUpdate(
    { _id: chatId, "joinDates.userId": memberId },
    {
      $set: {
        "joinDates.$.updatedDate": new Date(),
        "joinDates.$.isRemoved": true,
      },
    },
    { new: true }
  );

  if (!updatedChat) {
    const error = new Error("사용자 제거 실패") as IError;
    error.statusCode = 500; // Internal Server Error
    throw error;
  }

  // 성공적으로 업데이트된 채팅 데이터 반환
  return updatedChat;
};

// 사용자 채팅 로직 임의 추가
// 사용자 채팅에서 제거 (강퇴, 탈퇴 처리)
// 채팅에 남은 사용자가 없을 경우. 채팅방 삭제
const leaveFromChat = async (chatId: ObjectId, memberId: ObjectId) => { 
  const isAddedUserChat = await Chat.findOne({ _id: chatId, isGroupChat: true, users: memberId });

  if (!isAddedUserChat) {
    const error = new Error("해당 채팅방 없거나 방장 아닌 유저 또는 해당 방에 유저없음") as IError;
    error.statusCode = 409;
    throw error; 
  }else if(isAddedUserChat.groupAdmin._id.toString() === memberId){
    const error = new Error("방장은 채팅방을 나갈 수 없습니다.") as IError;
    error.statusCode = 409;
    throw error; 
  }else {
    console.log(isAddedUserChat.groupAdmin._id);
    console.log(memberId);
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
          $pull: { users: memberId },
        },
        {
          new: true,
        }
      ).where({ isGroupChat: true })
        .populate("users", "-password")
    
    if (!updateChat) {
      const error = new Error("그륩 채팅 조회 실패") as IError;
      error.statusCode = 404;
      throw error;
    } else {
      if (updateChat?.users.length == 0) {
        const res = await Chat.updateOne({ _id: chatId }, { $set: { isDeleted: true } });
      }
      return updateChat;
    }
  }
}

//
const updateChatName = async (chatId: ObjectId, chatName: string, reqMemberId: ObjectId) => { 
  const chat = await Chat.findOne({ _id: chatId, groupAdmin: reqMemberId, isGroupChat: true });

  if (!chat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }
  chat.chatName = chatName;
  const updateChat = await chat.save();
  
  if (!updateChat) {
    const error = new Error("공지사항 업데이트 실패") as IError;
    error.statusCode = 500;
    throw error;
  }  
  return updateChat;
}

// 채팅방 공지 생성
const createChatNotification = async (chatId: ObjectId, memberId: ObjectId, notiContent: string) => {
  const isChat = await Chat.findOne({ _id: chatId, groupAdmin: memberId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }
  
  if(isChat.topNoti) 
    isChat.noti[isChat.topNoti].isTop = false;

  const newNoti = {
    _id: new mongoose.Types.ObjectId(),
    isTop: true,
    contents: notiContent
  };

  isChat.noti.push(newNoti);
  isChat.topNoti = isChat.noti.length - 1;

  const updatedChat = await isChat.save();

  return updatedChat;
}

// 채팅방 공지 수정
const editChatNotification = async (chatId: ObjectId, memberId: ObjectId, noticeId: ObjectId, notiContent: string, isTop: boolean) => {
  const isChat = await Chat.findOne({ _id: chatId, groupAdmin: memberId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }

  const isNoti = isChat.noti.findIndex(noti => noti._id === noticeId);
  if (isNoti == -1) {
    const error = new Error("공지사항 찾을 수 없음") as IError;
    error.statusCode = 404;
    throw error;
  }
  if(isTop && isNoti !== isChat.topNoti) {
    if(isChat.topNoti) 
      isChat.noti[isChat.topNoti].isTop = false;
    isChat.topNoti = isNoti;
  }
  if(isTop != null)
    isChat.noti[isNoti].isTop = isTop;
  isChat.noti[isNoti].contents = notiContent;

  const updateChat = await isChat.save();
  
    if (!updateChat) {
      const error = new Error("공지사항 업데이트 실패") as IError;
      error.statusCode = 500;
      throw error;
    }  
  return updateChat;
}

// 현재 공지 내리기.
const demoteChatNotification = async (chatId: ObjectId, memberId: ObjectId) => {
  const isChat = await Chat.findOne({ _id: chatId, groupAdmin: memberId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }

  const noticeIdx = isChat.topNoti;
  if (noticeIdx === null) {
    const error = new Error("현재 공지가 설정되어 있지 않습니다") as IError;
    error.statusCode = 404;
    throw error;
  }
  
  isChat.noti[noticeIdx].isTop = false;
  isChat.topNoti = null;

  const updatedChat = await isChat.save();
  
  return updatedChat;
}

// 공지 삭제.
const removeChatNotification = async (chatId: ObjectId, memberId: ObjectId, noticeId: ObjectId) => {
  const isChat = await Chat.findOne({ _id: chatId, groupAdmin: memberId, isGroupChat: true });
  if (!isChat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }

  const noticeIdx = isChat.noti.findIndex(noti => noti._id === noticeId);
  if (noticeIdx === -1) {
    const error = new Error("공지사항을 찾을 수 없음") as IError;
    error.statusCode = 404;
    throw error;
  }

  const update:any = {
    $pull: { noti: { _id: noticeId } }
  };

  if(isChat.topNoti !== null){
    if (isChat.topNoti === noticeIdx) {
      update["$set"] = { topNoti: null }
    }else if (noticeIdx < isChat.topNoti) {
      update["$set"] = { topNoti: isChat.topNoti - 1 }
    }
  }

  const deletedNoti = await Chat.findByIdAndUpdate(
    chatId,
    update,
    { new: true }
  )
  
    if (!deletedNoti) {
      const error = new Error("공지사항 삭제 실패") as IError;
      error.statusCode = 500;
      throw error;
    }  
  return deletedNoti;
}

// 채팅 내 전체 공지 확인
const getAllNoticeInChat = async (chatId: ObjectId, memberId: ObjectId) => {
  const isChat = await Chat.findOne({ _id: chatId, users: memberId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅에 속하지 않았거나, 채팅이 없음.") as IError;
    error.statusCode = 409;
    throw error;
  }

  const notis = isChat.noti || [];
  
  return notis;
}

// 채팅 내 공지 단일 확인
const getNoticeInChat = async (chatId: ObjectId, memberId: ObjectId, noticeId: ObjectId) => {
  const isChat = await Chat.findOne({ _id: chatId, users: memberId, isGroupChat: true });
  if (!isChat) {
    const error = new Error("채팅에 속하지 않았거나, 채팅이 없음.") as IError;
    error.statusCode = 409;
    throw error;
  }

  const notice = isChat.noti.find(noti => noti._id === noticeId);
  if (!notice) {
    const error = new Error("공지사항 찾을 수 없음") as IError;
    error.statusCode = 404;
    throw error;
  }

  return notice;
}



export default {
  isRoomAuth,
  getChat,
  //getAccessChat,
  //fetchChats,
  createGroupChat,
  updateGroupChat,
  addToGroup,
  removeFromGroup,
  deleteChat,
  recordUserJoin,
  recordUserOut,
  leaveFromChat,
  updateChatName,
  createChatNotification,
  editChatNotification,
  demoteChatNotification,
  removeChatNotification,
  getAllNoticeInChat,
  getNoticeInChat
};
