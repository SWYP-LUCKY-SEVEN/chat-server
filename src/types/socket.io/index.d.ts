import { Socket } from 'socket.io';
import IUserDTO from '@src/dtos/userDto';

declare module 'socket.io' {
  export interface Socket {
    user: IUserDTO;
    roomId: string;
  }
}
