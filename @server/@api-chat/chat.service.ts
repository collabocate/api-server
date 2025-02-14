import { Server, Socket } from 'socket.io';
import { success, error } from '../lib/helpers';

interface ChatMessage {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export class ChatService {
  private static instance: ChatService;
  private connectedUsers: Map<string, Socket> = new Map();
  private messages: ChatMessage[] = [];
  private io: Server | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public setIO(io: Server): void {
    this.io = io;
  }

  public handleConnection(socket: Socket, userId: string): void {
    this.connectedUsers.set(userId, socket);
    this.logUserEvent('connected', userId);

    socket.emit('connection_status', {
      status: 'connected',
      userId: userId,
      timestamp: new Date()
    });

    // Check for any pending messages and update their status
    this.updatePendingMessages(userId);
  }

  public handleDisconnection(userId: string): void {
    this.connectedUsers.delete(userId);
    this.logUserEvent('disconnected', userId);
  }

  public getUserSocket(userId: string): Socket | undefined {
    return this.connectedUsers.get(userId);
  }

  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  public updateMessageStatus(messageId: string, status: 'sent' | 'delivered' | 'read'): void {
    const messageIndex = this.messages.findIndex(msg => msg.messageId === messageId);
    if (messageIndex !== -1) {
      this.messages[messageIndex].status = status;
      success(`Message ${messageId} status updated to ${status}`);
      
      // Notify sender about the status update
      const message = this.messages[messageIndex];
      const senderSocket = this.connectedUsers.get(message.senderId);
      if (senderSocket) {
        senderSocket.emit('message_status_update', {
          messageId,
          status,
          timestamp: new Date()
        });
      }
    } else {
      error(`Message ${messageId} not found`);
    }
  }

  private updatePendingMessages(userId: string): void {
    const pendingMessages = this.messages.filter(
      msg => msg.receiverId === userId && msg.status === 'sent'
    );

    pendingMessages.forEach(msg => {
      this.updateMessageStatus(msg.messageId, 'delivered');
    });
  }

  public sendMessage(senderId: string, receiverId: string, content: string): boolean {
    const receiverSocket = this.connectedUsers.get(receiverId);
    const message: ChatMessage = {
      messageId: Math.random().toString(36).substring(7),
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
      status: receiverSocket ? 'delivered' : 'sent'
    };

    this.messages.push(message);

    if (receiverSocket) {
      receiverSocket.emit('receive_message', message);
      success(`Message sent from ${senderId} to ${receiverId}`);
      return true;
    }
    error(`Failed to send message: user ${receiverId} is offline`);
    return false;
  }

  public getMessages(senderId: string, receiverId: string): ChatMessage[] {
    const messages = this.messages.filter(message => 
      (message.senderId === senderId && message.receiverId === receiverId) ||
      (message.senderId === receiverId && message.receiverId === senderId)
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    success(`Retrieved ${messages.length} messages between users ${senderId} and ${receiverId}`);
    return messages;
  }

  private logUserEvent(event: 'connected' | 'disconnected', userId: string): void {
    const logMessage = `User ${userId} ${event} at ${new Date().toISOString()}`;
    if (event === 'connected') {
      success(logMessage);
    } else {
      error(logMessage);
    }
  }
}
