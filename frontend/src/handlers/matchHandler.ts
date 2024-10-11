import { io, Socket } from "socket.io-client";
import {
  MATCH_ACCEPTED,
  MATCH_DECLINED,
  MATCH_FOUND,
  MATCH_RECEIVED,
  MATCH_REQUEST,
  MATCH_SUCCESSFUL,
  MATCH_TIMEOUT,
  MATCH_UNSUCCESSFUL,
  SOCKET_CLIENT_DISCONNECT,
  SOCKET_DISCONNECT,
  SOCKET_RECONNECT_FAILED,
} from "../utils/constants";
import { User } from "../types/types";

const SOCKET_URL = "http://localhost:3002";

export class MatchHandler {
  socket: Socket;
  matchId?: string;

  constructor() {
    this.socket = io(SOCKET_URL, {
      reconnectionAttempts: 3,
    });
  }

  findMatch = (
    user: User,
    complexities: string[],
    categories: string[],
    languages: string[],
    timeout: number
  ) => {
    this.socket.emit(MATCH_REQUEST, {
      user: {
        id: user.id,
        username: user.username,
        profile: user.profilePictureUrl,
      },
      complexities: complexities,
      categories: categories,
      languages: languages,
      timeout: timeout,
    });

    this.socket.on(MATCH_FOUND, ({ matchId, user1, user2 }) => {
      console.log(`Match ID: ${matchId}`);
      console.log(`User 1: ${user1.username}`);
      console.log(`User 2: ${user2.username}`);
      this.matchId = matchId;
      this.socket.emit(MATCH_RECEIVED, this.matchId);
    });

    this.socket.on(MATCH_SUCCESSFUL, () => {
      console.log("Match successful");
      this.closeConnection();
    });

    this.socket.on(MATCH_UNSUCCESSFUL, () => {
      console.log("Match unsuccessful");
      this.closeConnection();
    });

    this.socket.on(MATCH_TIMEOUT, () => {
      console.log("Match timeout");
      this.closeConnection();
    });

    this.socket.on(SOCKET_DISCONNECT, (reason) => {
      if (reason !== SOCKET_CLIENT_DISCONNECT) {
        console.log("Oops, something went wrong! Reconnecting...");
      }
    });

    this.socket.io.on(SOCKET_RECONNECT_FAILED, () => {
      console.log("Oops, something went wrong! Please try again later.");
    });
  };

  acceptMatch = () => {
    this.socket.emit(MATCH_ACCEPTED, this.matchId);
  };

  declineMatch = () => {
    this.socket.emit(MATCH_DECLINED, this.matchId);
  };

  stopMatch = () => {
    this.closeConnection();
  };

  closeConnection = () => {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  };
}
