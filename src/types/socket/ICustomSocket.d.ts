import { Socket } from 'socket.io';
import IMemberDTO from '@src/dtos/memberDto';

export interface ICustomSocket extends Socket {
  member: IMemberDTO;
  roomId: string;
}