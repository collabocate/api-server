import { Router } from 'express';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Server } from 'socket.io';
import { ChatController } from './chat.controller';
import { ChatMessage } from '@ts-types/index';

interface MessageRequest {
  senderId: string;
  receiverId: string;
  content: string;
}

interface MessageResponse {
  success: boolean;
  delivered: boolean;
  timestamp: Date;
  message: string;
  error?: string;
  messages?: ChatMessage[];
  participants?: {
    senderId: string;
    receiverId: string;
  };
}

export class ChatRoutes {
  private router: Router;
  private chatController: ChatController;
  private io: Server;

  constructor(io: Server) {
    this.router = Router();
    this.chatController = new ChatController();
    this.io = io;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/messages', this.sendMessage);
    this.router.get('/messages/:senderId/:receiverId', this.getMessages);
  }

  private sendMessage = async (req: ExpressRequest, res: ExpressResponse<MessageResponse>) => {
    try {
      const { senderId, receiverId, content } = req.body as MessageRequest;

      if (!senderId || !receiverId || !content) {
        return res.status(400).json({
          success: false,
          delivered: false,
          timestamp: new Date(),
          message: 'Missing required fields'
        });
      }

      const result = this.chatController.sendMessage(
        senderId,
        receiverId,
        content
      );

      return res.json({
        ...result,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        delivered: false,
        timestamp: new Date(),
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };

  private getMessages = async (req: ExpressRequest, res: ExpressResponse<MessageResponse>) => {
    try {
      const { senderId, receiverId } = req.params;
      const messageHistory = this.chatController.getMessages(senderId, receiverId);
      const isReceiverOnline = this.chatController.checkUserOnline?.(receiverId) ?? false;

      res.json({
        success: true,
        delivered: isReceiverOnline,
        timestamp: new Date(),
        message: isReceiverOnline ? 
          'Messages retrieved and delivered' : 
          'Messages retrieved but user is offline',
        messages: messageHistory,
        participants: {
          senderId,
          receiverId
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        delivered: false,
        timestamp: new Date(),
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };

  public getRouter(): Router {
    return this.router;
  }
}
