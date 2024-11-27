import Chat from "@src/models/chatModel";
import Message from "@src/models/messageModel";
import Picture from "@src/models/pictureModel"
import Member from "@src/models/memberModel";
import generateToken from "@configs/generateToken";
import moment from 'moment'
import mongoose from "mongoose";

type ObjectId = mongoose.Types.ObjectId;

interface IError extends Error {
    statusCode: number;
}

const getPictureData = async(picId: string) => {
  if (!picId) {
    const error = new Error("picId 확인") as IError;
    error.statusCode = 400;
    throw error;
  } else {
    const picture = await Picture.find({ _id: picId })
      .populate("uploadedBy", "nickname pic email")
      .populate("chat");

    if (picture) return picture;
    else {
      const error = new Error("이미지 조회 실패") as IError;
      error.statusCode = 404;
      throw error;
    }
  }
}
const getChatGallery = async(chatId: ObjectId) => {
    if (!chatId) {
        const error = new Error("picId 확인") as IError;
        error.statusCode = 400;
        throw error;
    } else {
        const ObjectchatId = new mongoose.Types.ObjectId(chatId);
        const pictureByDay = await Picture.aggregate([
            { $match: { chat: ObjectchatId } },
            {
                $lookup: {  //Join
                    from: 'users', // 조인할 컬렉션 이름 (Member => users, Chat => chats)
                    localField: 'uploadedBy', // Picture 컬렉션의 필드
                    foreignField: '_id', // Member 컬렉션의 필드
                    as: 'uploadedByUser' // 결과 배열 필드 이름 (lookup의 결과는 항상 배열)
                }
            },
            { $unwind: '$uploadedByUser' },// 배열 => 객체
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    photos: { 
                        $push: {
                            _id: '$_id', 
                            url: '$url', 
                            uploadedBy: '$uploadedByUser', 
                            timestamp: '$createdAt' 
                        } 
                    }
                }
            },
            {
              $sort: { _id: -1 } // 날짜 오름차순으로 정렬
            }
          ]);
        return pictureByDay;
    }
}
const getChatSimpleGallery = async(chatId: ObjectId, limit: number) => {
    if (!chatId) {
        const error = new Error("picId 확인") as IError;
        error.statusCode = 400;
        throw error;
      } else {
        const pictures = await Picture.find({ chat: chatId })
            .sort({ timestamp: -1 })    
            .limit(limit)
            .populate("uploadedBy", "nickname pic email");
    
        if (pictures) return pictures;
        else {
          const error = new Error("이미지 조회 실패") as IError;
          error.statusCode = 404;
          throw error;
        }
      }
}

const postPicture = async(url: string, chatId: ObjectId, reqMemberId: ObjectId) => {
    if (!url || !chatId) {
        const error = new Error("유효하지 않은 요청") as IError;
        error.statusCode = 400;
        throw error;
    }
      
    const newPicture = {
        chat: chatId,
        uploadedBy: reqMemberId,
        url,
    };
    console.log(newPicture)
    let picture = await Picture.create(newPicture);
    picture = await (
        await picture.populate("uploadedBy", "nickname pic")
    ).populate("chat");
    
    const result = await Member.populate(picture, {
        path: "chat.users",
        select: "nickname pic email",
    });

    if (result) {
        return result;
    } else {
        const error = new Error("이미지 저장에 실패") as IError;
        error.statusCode = 500;
        throw error;
    }
}

  
export default {
    getPictureData,
    getChatGallery,
    getChatSimpleGallery,
    postPicture
  };
  