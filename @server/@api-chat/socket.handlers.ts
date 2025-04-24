import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { UserStore } from '../@api-chat/user.store';
import Message from '../@api-chat/message.model';
import dotenv from 'dotenv';

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

interface JwtPayload {
  _id: string;
  username: string;
  [key: string]: unknown;
}

interface SocketWithUser extends Socket {
  user: {
    userId: string;
    username: string;
  };
}

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "Chat-app";

export function setupSocketHandlers(io: Server): void {
  // Authentication middleware
  io.use((socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
      
      (socket as SocketWithUser).user = {
        userId: decoded._id,
        username: decoded.username
      };

      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection event handler
  io.on('connection', (socket: Socket) => {
    const typedSocket = socket as SocketWithUser;

    if (!typedSocket.user || !typedSocket.user.userId) {
      socket.disconnect();
      return;
    }

    const { userId } = typedSocket.user;
    let username = typedSocket.user.username;

    if (!username) {
      username = `User-${userId.substring(0, 6)}`;
      typedSocket.user.username = username;
    }

    // Register authenticated user
    UserStore.addUser(userId, socket.id, username);

    // Broadcast user's online status to all connected clients
    io.emit('user_status', { userId, username, status: 'online' });

    // Send connected user list to all clients
    // IMPORTANT: Changed from 'user_list' to 'online_users' to match client expectation
    io.emit('online_users', UserStore.getAllUsers());

    // Handle request for online users
    socket.on('get_online_users', () => {
      socket.emit('online_users', UserStore.getAllUsers());
    });

    // Get unread messages for the user
    socket.on('get_message_history', async (data: { userId: string } | string) => {
      try {
        const otherUserId = typeof data === 'object' ? data.userId : data; // Handle both object and string format

        const messages = await Message.find({
          $or: [
            { sender: userId, recipient: otherUserId },
            { sender: otherUserId, recipient: userId }
          ]
        }).sort({ createdAt: 1 });

        // Transform messages to include sender username
        const transformedMessages = messages.map(msg => {
          const senderUsername = msg.sender === userId ? username : UserStore.getUsername(msg.sender) || 'Unknown';
          return {
            id: msg._id,
            senderId: msg.sender,
            senderUsername,
            recipientId: msg.recipient,
            content: msg.content,
            read: msg.read,
            createdAt: msg.createdAt
          };
        });

        socket.emit('message_history', transformedMessages);

        // Mark messages as read
        await Message.updateMany(
          { sender: otherUserId, recipient: userId, read: false },
          { $set: { read: true } }
        );
      } catch (error) {
        socket.emit('error', 'Failed to retrieve message history');
      }
    });

    // Mark entire conversation as read
    socket.on('mark_conversation_read', async (data: { userId: string } | string) => {
      try {
        const otherUserId = typeof data === 'object' ? data.userId : data;

        await Message.updateMany(
          { sender: otherUserId, recipient: userId, read: false },
          { $set: { read: true } }
        );

      } catch (error) {
        socket.emit('error', 'Failed to mark conversation as read');
      }
    });

    // Direct messaging
    socket.on('direct_message', async (data: DirectMessageData) => {
      try {
        const recipientId = data.recipientId || data.recipient;
        const recipientSocketId = UserStore.getSocketId(recipientId);

        // Create and save message to database
        const newMessage = new Message({
          sender: userId,
          recipient: recipientId,
          content: data.content,
          read: false,
          createdAt: new Date()
        });

        await newMessage.save();

        const messageResponse: MessageResponse = {
          messageId: newMessage._id.toString(),
          sender: username,
          senderId: userId,
          recipientId: recipientId,
          content: data.content,
          timestamp: newMessage.createdAt.toISOString(),
          read: false
        };

        // Send to recipient if online
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('direct_message', messageResponse);
        }

        // Confirm to sender
        socket.emit('message_sent', messageResponse);
      } catch (error) {
        socket.emit('message_error', 'Failed to send message');
      }
    });

    socket.on('test_event', () => {
      // Removed console.log - replace with proper logging if needed
      socket.emit('test_response', { received: true });
    });

    // Mark messages as read
    socket.on('mark_as_read', async (data: { messageId: string } | string) => {
      try {
        const messageId = typeof data === 'object' ? data.messageId : data;

        await Message.findByIdAndUpdate(messageId, { read: true });
        const message = await Message.findById(messageId);

        if (message) {
          const senderSocketId = UserStore.getSocketId(message.sender);
          if (senderSocketId) {
            io.to(senderSocketId).emit('message_read', messageId);
          }
        }
      } catch (error) {
        socket.emit('error', 'Failed to mark message as read');
      }
    });

    // User is typing event
    socket.on('typing', (data: { recipientId: string } | string) => {
      const recipientId = typeof data === 'object' ? data.recipientId : data;
      const recipientSocketId = UserStore.getSocketId(recipientId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('user_typing', { userId, username });
      }
    });

    // User stopped typing event
    socket.on('stopped_typing', (data: { recipientId: string } | string) => {
      const recipientId = typeof data === 'object' ? data.recipientId : data;
      const recipientSocketId = UserStore.getSocketId(recipientId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('user_stopped_typing', { userId });
      }
    });

    // Disconnection handling
    socket.on('disconnect', () => {
      UserStore.removeUser(userId);
      // IMPORTANT: Changed from 'user_list' to 'online_users' to match client expectation
      io.emit('online_users', UserStore.getAllUsers());
      io.emit('user_status', { userId, username, status: 'offline' });
      io.emit('user_disconnected', userId);
    });
  });
}
