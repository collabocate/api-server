import jwt from 'jsonwebtoken';
import { DirectMessageData, MessageResponse } from './interfaces';
import { UserStore } from './user.store';
import { success, error, warning } from '@lib/helpers';
import Message from './message.model';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "Chat-app";

export function setupSocketHandlers(io: any): void {
  // Authentication middleware
  io.use((socket: any, next: Function) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      error('Authentication error: Token required');
      return next(new Error('Authentication error: Token required'));
    }

    jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
      if (err) {
        error('Authentication error: Invalid token');
        return next(new Error('Authentication error: Invalid token'));
      }

      socket.user = {
        userId: decoded._id,
        username: decoded.username
      };

      next();
    });
  });

  // Connection event handler
  io.on('connection', (socket: any) => {

    if (!socket.user || !socket.user.userId) {
      socket.disconnect();
      return;
    }

    const { userId, username } = socket.user;

    if (!username) {
      warning('User connected without username');
      // You might want to set a default username or disconnect the socket
    }

    success(`SOCKET, User connected, { ${userId}, ${username}, socketId: ${socket.id} }`);

    // Register authenticated user
    UserStore.addUser(userId, socket.id, username);

    // Broadcast user's online status to all connected clients
    io.emit('user_status', { userId, username, status: 'online' });

    // Send connected user list to all clients
    // IMPORTANT: Changed from 'user_list' to 'online_users' to match client expectation
    io.emit('online_users', UserStore.getAllUsers());

    // Handle request for online users
    socket.on('get_online_users', () => {
      success(`SOCKET, Client requested online users list, { ${userId}, socketId: ${socket.id} }`);
      success(`Sending online users:, ${UserStore.getAllUsers()}`);
      socket.emit('online_users', UserStore.getAllUsers());
    });

    // Get unread messages for the user
    socket.on('get_message_history', async (data: { userId: any; }) => {
      try {
        const otherUserId = data.userId || data; // Handle both object and string format

        success(`SOCKET, Getting message history, { ${userId}, ${otherUserId} }`);

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
        error('Failed to retrieve message history');
        socket.emit('error', 'Failed to retrieve message history');
      }
    });

    // Mark entire conversation as read
    socket.on('mark_conversation_read', async (data: { userId: any; }) => {
      try {
        const otherUserId = data.userId || data;

        await Message.updateMany(
          { sender: otherUserId, recipient: userId, read: false },
          { $set: { read: true } }
        );

        error('Marked conversation as read');
      } catch (error) {
        error('Failed to mark conversation as read');
        socket.emit('error', 'Failed to mark conversation as read');
      }
    });

    // Direct messaging
    socket.on('direct_message', async (data: DirectMessageData) => {
      try {
        const recipientId = data.recipientId || data.recipient;
        const recipientSocketId = UserStore.getSocketId(recipientId);

        success(`SOCKET, Direct message, {
          from: ${userId},
          to: ${recipientId},
          hasRecipientSocket: ${!!recipientSocketId}
        }`);

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
        error('Failed to send message');
        socket.emit('message_error', 'Failed to send message');
      }
    });

    socket.on('test_event', (data: any) => {
      success(`Received test event: ${data}`);
      socket.emit('test_response', { received: true });
    });

    // Mark messages as read
    socket.on('mark_as_read', async (data: { messageId: any; }) => {
      try {
        const messageId = data.messageId || data;

        await Message.findByIdAndUpdate(messageId, { read: true });
        const message = await Message.findById(messageId);

        if (message) {
          const senderSocketId = UserStore.getSocketId(message.sender);
          if (senderSocketId) {
            io.to(senderSocketId).emit('message_read', messageId);
          }
        }
      } catch (error) {
        error('Failed to mark message as read');
        socket.emit('error', 'Failed to mark message as read');
      }
    });

    // User is typing event
    socket.on('typing', (data: { recipientId: any; }) => {
      const recipientId = data.recipientId || data;
      const recipientSocketId = UserStore.getSocketId(recipientId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('user_typing', { userId, username });
      }
    });

    // User stopped typing event
    socket.on('stopped_typing', (data: { recipientId: any; }) => {
      const recipientId = data.recipientId || data;
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
      warning('Client disconnected');
    });
  });
}
