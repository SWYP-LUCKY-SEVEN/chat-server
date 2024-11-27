import { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { chatService } from "@services/index";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { toObjectId } from "@src/configs/toObjectId";

interface IError extends Error {
  statusCode: number;
}

const getChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const reqMemberId = req.member?._id;
    if (reqMemberId && studyId) {
      const chatId = toObjectId(studyId);

      const user = await chatService.getChat(chatId, reqMemberId);
      res.status(200).json(user);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// const getAccessChat = asyncHandler(async (req: Request, res: Response) => {
//   try {
//     const { memberId } = req.body;
//     const reqUseId = req.member?._id;
//     if (reqUseId) {
//       const user = await chatService.getAccessChat(userId, reqUseId);
//       res.status(200).json(user);
//     }
//   } catch (error: any) {
//     errorLoggerMiddleware(error as IError, req, res);
//     res.status(error.statusCode).json(error.message);
//   }
// });

// const fetchChats = asyncHandler(async (req: Request, res: Response) => {
//   try {
//     const reqUseId = req.member?._id;
//     console.log(reqUseId, "reqUseId")
//     if (reqUseId) {
//       const user = await chatService.fetchChats(reqUseId);
//       res.status(200).json(user);
//     }
//   } catch (error: any) {
//     errorLoggerMiddleware(error as IError, req, res);
//     res.status(error.statusCode).json(error.message);
//   }
// });

const createGroupChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId, name, studyId } = req.body;
    const chatId = toObjectId(studyId);
    const memberId = toObjectId(userId);

    const groupChat = await chatService.createGroupChat(memberId, chatId, name);
    res.status(200).json(groupChat);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const updateGroupChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId, chatName } = req.body;

    
    const chatId = toObjectId(studyId);

    const updatedGroupChat = await chatService.updateGroupChat(
      chatId,
      chatName
    );
    res.status(200).json(updatedGroupChat);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 사용자 채팅에 추가
const addToGroup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId, userId, type } = req.body;

    const chatId = toObjectId(studyId);
    const reqMemberId = req.member?._id; // JWT 정보 확인 미들웨어에서 이미 ObjectId화 됨.
    let memberId
    if (type == "join") {
      memberId = reqMemberId;
    } else if (type == "accept") {
      memberId = toObjectId(userId);
    }
    if (chatId && memberId) {
      const updatedGroupChat = await chatService.addToGroup(chatId, memberId, reqMemberId);
      res.status(200).json(updatedGroupChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 사용자 채팅에서 제거
const removeFromGroup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId, userId } = req.body;
    const reqMemberId = req.member?._id;

    const chatId = toObjectId(studyId);
    const memberId = toObjectId(userId);
    if (chatId && memberId) {
      const updatedGroupChat = await chatService.removeFromGroup(chatId, memberId, reqMemberId);
      res.status(200).json(updatedGroupChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

//채팅 제거
const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const reqUseId = req.member?._id;
    
    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);
    if (reqMemberId && chatId) {
      const deleteChat = await chatService.deleteChat(chatId, reqMemberId);
      res.status(200).json(deleteChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const recordUserJoin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const reqUseId = req.member?._id;

    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);
    if (reqMemberId && chatId) {
      const deleteChat = await chatService.recordUserJoin(chatId, reqMemberId);
      res.status(200).json(deleteChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const recordUserOut = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const reqUseId = req.member?._id;
    
    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);
    if (reqMemberId && chatId) {
      const deleteChat = await chatService.recordUserOut(chatId, reqMemberId);
      res.status(200).json(deleteChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});


// 사용자 채팅 로직 임의 추가

// 사용자 채팅에서 나가기
const leaveFromChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { studyId } = req.body;
    
    const chatId = toObjectId(studyId);
    const memberId = toObjectId(userId);
    if (chatId && memberId) {
      const updatedGroupChat = await chatService.leaveFromChat(
        chatId, 
        memberId
      );
      res.status(200).json(updatedGroupChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});
// 채팅방 이름 업데이트
const updateChatName = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId, chatName } = req.body;
    const reqUseId = req.member?._id;

    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);

    const updatedGroupChat = await chatService.updateChatName(
      chatId,
      chatName,
      reqMemberId
    );
    res.status(200).json(updatedGroupChat);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});


// 공지 작성 
const createChatNotification = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const { notiContent } = req.body;
    const reqUseId = req.member?._id;
    
    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);

    if (reqMemberId && chatId) {
      const createNotiChat = await chatService.createChatNotification(chatId, reqMemberId, notiContent);
      res.status(201).json(createNotiChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 기존 공지 수정 (noti id)
const editChatNotification = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const { notiId, notiContent, isTop } = req.body;
    const reqUseId = req.member?._id;
    
    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);
    if (reqMemberId && chatId) {
      const editNotiChat = await chatService.editChatNotification(chatId, reqMemberId, notiId, notiContent, isTop);
      res.status(200).json(editNotiChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 공지 내리기 (현재 top을 제거)
const demoteChatNotification = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const reqUseId = req.member?._id;
    
    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);
    if (reqMemberId && chatId) {
      const demoteNotiChat = await chatService.demoteChatNotification(chatId, reqMemberId);
      res.status(200).json(demoteNotiChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 공지 삭제 (noti id)
const removeChatNotification = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const { noticeId } = req.query;
    const reqUseId = req.member?._id;
    
    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);
    const notiId = toObjectId(noticeId);
    if (reqMemberId && chatId && notiId) {
      const removeNotiChat = await chatService.removeChatNotification(chatId, reqMemberId, notiId);
      res.status(200).json(removeNotiChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

//전체 공지 확인
const getAllNoticeInChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const reqUseId = req.member?._id;
    
    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);
    if (reqMemberId && chatId) {
      const notiList = await chatService.getAllNoticeInChat(chatId, reqMemberId);
      res.status(200).json(notiList);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 단일 공지 확인
const getNoticeInChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const { noticeId } = req.query;
    const reqUseId = req.member?._id;
    
    const chatId = toObjectId(studyId);
    const reqMemberId = toObjectId(reqUseId);
    const notiId = toObjectId(noticeId);
    if (reqMemberId && chatId) {
      const notice = await chatService.getNoticeInChat(chatId, reqMemberId, notiId);
      res.status(200).json(notice);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});


export default {
  getChat,
  createGroupChat,
  addToGroup,
  updateGroupChat,
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
