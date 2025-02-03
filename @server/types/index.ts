import { Request } from "express";
import { UserDocument, UserRole } from "@server/@api-user/user.model";

export interface ReqUser extends Request {
  user?: {
    _id?: string;
    email?: string;
    role?: UserRole;
  }
}

export type Payload = Pick<UserDocument, "_id" | "email" | "role">;