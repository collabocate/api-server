// src/api-chat/userStore.ts

interface UserData {
  socketId: string;
  username?: string;
}

// Users storage - Map of userId to socket ID and user data
const users: Map<string, UserData> = new Map();

export const UserStore = {
  // Add a user
  addUser(userId: string, socketId: string, username?: string): void {
    users.set(userId, { socketId, username });
  },

  // Remove a user
  removeUser(userId: string): void {
    users.delete(userId);
  },

  // Check if user exists
  userExists(userId: string): boolean {
    return users.has(userId);
  },

  // Get socket ID by userId
  getSocketId(userId: string): string | undefined {
    const userData = users.get(userId);
    return userData ? userData.socketId : undefined;
  },

  // Add to UserStore object in userStore.ts
  getUsername(userId: string): string | undefined {
    const userData = users.get(userId);
    return userData ? userData.username : undefined;
  },

  // Get all users with their data
  getAllUsers(): Array<{ id: string, username?: string }> {
    return Array.from(users.entries()).map(([userId, userData]) => ({
      id: userId,
      username: userData.username
    }));
  }
};
