import { Socket } from 'socket.io';

export interface UserInfo {
  userId: string;
  username?: string;
}

export interface SocketWithUser extends Socket {
  user?: UserInfo;
}

export interface DirectMessageData {
  recipient: string;
  recipientId?: string;
  content: string;
}

export interface MessageResponse {
  messageId: string;
  sender?: string;
  senderId?: string;
  recipientId?: string;
  content: string;
  timestamp: string;
  read: boolean;
}
