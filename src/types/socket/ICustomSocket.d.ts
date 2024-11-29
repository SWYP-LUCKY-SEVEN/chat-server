import { Socket } from 'socket.io';
import IUserDTO from '@src/dtos/userDto';

export interface ICustomSocket extends Socket {
  user: IUserDTO;
  roomId: string;
}