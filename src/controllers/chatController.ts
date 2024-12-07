import { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { chatService } from "@services/index";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { toObjectId } from "@src/configs/utill";

interface IError extends Error {
  statusCode: number;
}

const getChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const reqUserId = req.user?._id;
    if (reqUserId && studyId) {
      const chatId = toObjectId(studyId);

      const resultChat = await chatService.getChat(chatId, reqUserId);
      res.status(200).json(resultChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// const getAccessChat = asyncHandler(async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.body;
//     const reqUserId = req.user?._id;
//     if (reqUserId) {
//       const user = await chatService.getAccessChat(userId, reqUserId);
//       res.status(200).json(user);
//     }
//   } catch (error: any) {
//     errorLoggerMiddleware(error as IError, req, res);
//     res.status(error.statusCode).json(error.message);
//   }
// });

// const fetchChats = asyncHandler(async (req: Request, res: Response) => {
//   try {
//     const reqUserId = req.user?._id;
//     console.log(reqUserId, "reqUserId")
//     if (reqUserId) {
//       const user = await chatService.fetchChats(reqUserId);
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
    const userObjectId = toObjectId(userId);

    const groupChat = await chatService.createGroupChat(userObjectId, chatId, name);
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
    const reqUserId = req.user?._id; // JWT 정보 확인 미들웨어에서 이미 ObjectId화 됨.
    let userObjectId
    if (type == "join") {
      userObjectId = reqUserId;
    } else if (type == "accept") {
      userObjectId = toObjectId(userId);
    }
    if (chatId && userObjectId) {
      const updatedGroupChat = await chatService.addToGroup(chatId, userObjectId, reqUserId);
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
    const reqUserId = req.user?._id;

    const chatId = toObjectId(studyId);
    const userObjectId = toObjectId(userId);
    if (chatId && userObjectId) {
      const updatedGroupChat = await chatService.removeFromGroup(chatId, userObjectId, reqUserId);
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
    const reqUserId = req.user?._id;
    
    const chatId = toObjectId(studyId);
    if (reqUserId && chatId) {
      const deleteChat = await chatService.deleteChat(chatId, reqUserId);
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
    const reqUserId = req.user?._id;

    const chatId = toObjectId(studyId);
    if (reqUserId && chatId) {
      const deleteChat = await chatService.recordUserJoin(chatId, reqUserId);
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
    const reqUserId = req.user?._id;
    
    const chatId = toObjectId(studyId);
    if (reqUserId && chatId) {
      const deleteChat = await chatService.recordUserOut(chatId, reqUserId);
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
    const userObjectId = toObjectId(userId);
    if (chatId && userId) {
      const updatedGroupChat = await chatService.leaveFromChat(
        chatId, 
        userObjectId
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
    const reqUserId = req.user?._id;

    const chatId = toObjectId(studyId);

    const updatedGroupChat = await chatService.updateChatName(
      chatId,
      chatName,
      reqUserId
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
    const reqUserId = req.user?._id;
    
    const chatId = toObjectId(studyId);

    if (reqUserId && chatId) {
      const createNotiChat = await chatService.createChatNotification(chatId, reqUserId, notiContent);
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
    const reqUserId = req.user?._id;
    
    const chatId = toObjectId(studyId);
    if (reqUserId && chatId) {
      const editNotiChat = await chatService.editChatNotification(chatId, reqUserId, notiId, notiContent, isTop);
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
    const reqUserId = req.user?._id;
    
    const chatId = toObjectId(studyId);
    if (reqUserId && chatId) {
      const demoteNotiChat = await chatService.demoteChatNotification(chatId, reqUserId);
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
    const reqUserId = req.user?._id;
    
    const chatId = toObjectId(studyId);
    const notiId = toObjectId(noticeId);
    if (reqUserId && chatId && notiId) {
      const removeNotiChat = await chatService.removeChatNotification(chatId, reqUserId, notiId);
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
    const reqUserId = req.user?._id;
    
    const chatId = toObjectId(studyId);
    if (reqUserId && chatId) {
      const notiList = await chatService.getAllNoticeInChat(chatId, reqUserId);
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
    const reqUserId = req.user?._id;
    
    const chatId = toObjectId(studyId);
    const notiId = toObjectId(noticeId);
    if (reqUserId && chatId) {
      const notice = await chatService.getNoticeInChat(chatId, reqUserId, notiId);
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
