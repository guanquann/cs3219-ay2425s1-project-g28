import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    profile_picture_url?: string;
    first_name?: string;
    last_name?: string;
    biography?: string;
  };
}
