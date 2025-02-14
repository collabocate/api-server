import { Request } from "express";
import { UserDocument, UserRole } from "@server/@api-user/user.model";

export interface ReqUser extends Request {
  user?: {
    _id?: string;
    email?: string;
    role?: UserRole;
  }
}

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export type Payload = Pick<UserDocument, "_id" | "email" | "role">;
