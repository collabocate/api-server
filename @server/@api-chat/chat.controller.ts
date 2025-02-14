import { ChatService } from './chat.service';
import { Socket } from 'socket.io';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = ChatService.getInstance();
  }

  public checkUserOnline(userId: string): boolean {
    return this.chatService.isUserOnline(userId);
  }

  public sendMessage(senderId: string, receiverId: string, content: string): {
    success: boolean;
    delivered: boolean;
    message: string;
  } {
    const delivered = this.chatService.sendMessage(senderId, receiverId, content);
    return {
      success: true,
      delivered,
      message: delivered ? 'Message sent and delivered' : 'Message sent but user is offline'
    };
  }

  public getMessages(senderId: string, receiverId: string) {
    return this.chatService.getMessages(senderId, receiverId);
  }

  public handleSocket(socket: Socket): void {
    socket.on('identify_user', (userId: string) => {
      this.chatService.handleConnection(socket, userId);

      socket.on('disconnect', () => {
        this.chatService.handleDisconnection(userId);
      });

      socket.on('send_message', (data: {
        senderId: string;
        receiverId: string;
        content: string;
      }) => {
        const result = this.chatService.sendMessage(
          data.senderId,
          data.receiverId,
          data.content
        );

        socket.emit('message_status', {
          success: true,
          delivered: result,
          timestamp: new Date(),
          messageData: data
        });
      });

      socket.on('message_delivered', (messageId: string) => {
        this.chatService.updateMessageStatus(messageId, 'delivered');
      });

      socket.on('message_read', (messageId: string) => {
        this.chatService.updateMessageStatus(messageId, 'read');
      });

      socket.on('typing_start', (data: { senderId: string; receiverId: string }) => {
        const receiverSocket = this.chatService.getUserSocket(data.receiverId);
        if (receiverSocket) {
          receiverSocket.emit('user_typing', { userId: data.senderId });
        }
      });

      socket.on('typing_end', (data: { senderId: string; receiverId: string }) => {
        const receiverSocket = this.chatService.getUserSocket(data.receiverId);
        if (receiverSocket) {
          receiverSocket.emit('user_stopped_typing', { userId: data.senderId });
        }
      });
    });
  }
}
