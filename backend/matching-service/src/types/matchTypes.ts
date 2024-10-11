import { Socket } from "socket.io";

export interface MatchUser {
  id: string;
  username: string;
  profile: string;
}

export interface MatchRequest {
  user: MatchUser;
  complexities: string[];
  categories: string[];
  languages: string[];
  timeout: number;
}

export interface MatchItem {
  socket: Socket;
  user: MatchUser;
  complexities: string[];
  categories: string[];
  languages: string[];
  timeout: NodeJS.Timeout;
  acceptedMatch: boolean;
}

export interface Match {
  [id: string]: {
    item1: MatchItem;
    item2: MatchItem;
    timeout: NodeJS.Timeout | null;
    accepted: boolean;
  };
}
