import { io } from "../../server";
import { v4 as uuidv4 } from "uuid";
import {
  MATCH_FOUND,
  MATCH_IN_PROGRESS,
  MATCH_SUCCESSFUL,
  MATCH_UNSUCCESSFUL,
  MATCH_REQUEST_ERROR,
} from "../utils/constants";
import { Socket } from "socket.io";
import { sendRabbitMq } from "../../config/rabbitmq";

interface MatchUser {
  id: string;
  username: string;
  profile?: string;
}

export interface MatchRequest {
  user: MatchUser;
  complexities: string[];
  categories: string[];
  languages: string[];
  timeout: number;
}

export interface MatchItem {
  user: MatchUser;
  complexities: string[];
  categories: string[];
  languages: string[];
  sentTimestamp: number;
  ttlInSecs: number;
}

const matches = new Map<string, boolean>();
const userSockets = new Map<string, Socket>();

export const createMatchItem = async (
  socket: Socket,
  matchRequest: MatchRequest,
  rematch?: boolean
): Promise<boolean> => {
  const { user, complexities, categories, languages, timeout } = matchRequest;

  if (!rematch && userSockets.has(user.id)) {
    console.log(`user request exists: ${user.username}`);
    socket.emit(MATCH_IN_PROGRESS);
    return false;
  }

  userSockets.set(user.id, socket);

  const matchQueueItem: MatchItem = {
    user: user,
    complexities: complexities,
    categories: categories,
    languages: languages,
    sentTimestamp: Date.now(),
    ttlInSecs: timeout,
  };

  const result = await sendRabbitMq(matchQueueItem);
  if (!result) {
    socket.emit(MATCH_REQUEST_ERROR);
  }
  return result;
};

export const createMatch = (matchItem1: MatchItem, matchItem2: MatchItem) => {
  const matchId = uuidv4();
  matches.set(matchId, false);

  userSockets.get(matchItem1.user.id)!.join(matchId);
  userSockets.get(matchItem2.user.id)!.join(matchId);
  io.to(matchId).emit(MATCH_FOUND, {
    matchId: matchId,
    user1: matchItem1.user,
    user2: matchItem2.user,
  });
};

export const handleMatchAcceptance = (matchId: string) => {
  const match = matches.has(matchId);
  if (!match) {
    return;
  }

  if (matches.get(matchId)) {
    io.to(matchId).emit(MATCH_SUCCESSFUL);
  } else {
    matches.set(matchId, true);
  }
};

export const handleRematch = async (
  socket: Socket,
  matchId: string,
  rematchRequest: MatchRequest
): Promise<boolean> => {
  if (matches.delete(matchId)) {
    socket.to(matchId).emit(MATCH_UNSUCCESSFUL); // TODO: emit other user reject?
  }

  return await createMatchItem(socket, rematchRequest, true);
};

export const handleMatchTermination = (terminatedSocket: Socket) => {
  for (const [uid, socket] of userSockets) {
    if (socket.id === terminatedSocket.id) {
      userSockets.delete(uid);
      break;
    }
  }

  // TODO: no access to rooms
  // const matchId = Array.from(terminatedSocket.rooms)[1];
  // const match = matches[matchId];
  // if (match) {
  //   delete matches[matchId];
  //   terminatedSocket.to(matchId).emit(MATCH_UNSUCCESSFUL);
  // }
};

export const hasUserDisconnected = (uid: string) => {
  return !userSockets.has(uid);
};
