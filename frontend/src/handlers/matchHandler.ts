import {
  MATCH_ACCEPTED,
  MATCH_DECLINED,
  MATCH_FOUND,
  MATCH_IN_PROGRESS,
  MATCH_RECEIVED,
  MATCH_REQUEST,
  MATCH_SUCCESSFUL,
  MATCH_TIMEOUT,
  MATCH_UNSUCCESSFUL,
  SOCKET_CLIENT_DISCONNECT,
  SOCKET_DISCONNECT,
  SOCKET_RECONNECT_FAILED,
  SOCKET_RECONNECT_SUCCESS,
} from "../utils/constants";
import { matchSocket } from "../utils/matchSocket";

interface MatchUser {
  id: string;
  username: string;
  profile?: string;
}

export class MatchHandler {
  matchId?: string;
  user: MatchUser;
  partner?: MatchUser;

  constructor(user: MatchUser) {
    this.user = user;
  }

  private setMatchDetails = (
    matchId: string,
    user1: MatchUser,
    user2: MatchUser
  ) => {
    this.matchId = matchId;
    user1.id !== this.user.id ? (this.partner = user1) : (this.partner = user2);

    console.log(`Match ID: ${this.matchId}`);
    console.log(`User: ${this.user!.username}`);
    console.log(`Partner: ${this.partner!.username}`);
  };

  private openConnection = () => {
    this.initSocketListeners();
    matchSocket.connect();
  };

  private closeConnection = () => {
    matchSocket.removeAllListeners();
    matchSocket.disconnect();
  };

  private initSocketListeners = () => {
    if (!matchSocket.hasListeners(MATCH_FOUND)) {
      matchSocket.on(MATCH_FOUND, ({ matchId, user1, user2 }) => {
        this.setMatchDetails(matchId, user1, user2);
        matchSocket.emit(MATCH_RECEIVED, this.matchId);
      });
    }

    if (!matchSocket.hasListeners(MATCH_IN_PROGRESS)) {
      matchSocket.on(MATCH_IN_PROGRESS, () => {
        console.log("Matching in progress... / Match already found!");
      });
    }

    if (!matchSocket.hasListeners(MATCH_SUCCESSFUL)) {
      matchSocket.on(MATCH_SUCCESSFUL, () => {
        console.log("Match successful");
        this.closeConnection();
      });
    }

    if (!matchSocket.hasListeners(MATCH_UNSUCCESSFUL)) {
      matchSocket.on(MATCH_UNSUCCESSFUL, () => {
        console.log("Match unsuccessful");
        this.closeConnection();
      });
    }

    if (!matchSocket.hasListeners(MATCH_TIMEOUT)) {
      matchSocket.on(MATCH_TIMEOUT, () => {
        console.log("Match timeout");
        this.closeConnection();
      });
    }

    if (!matchSocket.hasListeners(SOCKET_DISCONNECT)) {
      matchSocket.on(SOCKET_DISCONNECT, (reason) => {
        if (reason !== SOCKET_CLIENT_DISCONNECT) {
          console.log("Oops, something went wrong! Reconnecting...");
        }
      });
    }

    if (!matchSocket.io.hasListeners(SOCKET_RECONNECT_SUCCESS)) {
      matchSocket.io.on(SOCKET_RECONNECT_SUCCESS, () => {
        console.log("Reconnected!");
      });
    }

    if (!matchSocket.io.hasListeners(SOCKET_RECONNECT_FAILED)) {
      matchSocket.io.on(SOCKET_RECONNECT_FAILED, () => {
        console.log("Oops, something went wrong! Please try again later.");
      });
    }
  };

  findMatch = (
    complexities: string[],
    categories: string[],
    languages: string[],
    timeout: number
  ) => {
    this.openConnection();
    matchSocket.emit(MATCH_REQUEST, {
      user: this.user,
      complexities: complexities,
      categories: categories,
      languages: languages,
      timeout: timeout,
    });
  };

  acceptMatch = () => {
    matchSocket.emit(MATCH_ACCEPTED, this.matchId);
  };

  declineMatch = () => {
    matchSocket.emit(MATCH_DECLINED, this.matchId);
  };

  stopMatch = () => {
    this.closeConnection();
  };
}
