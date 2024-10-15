import { io } from "../../server";
import { Match, MatchItem, MatchRequest } from "../types/matchTypes";
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

const matches: Match = {};
export const userSockets: Map<string, Socket> = new Map<string, Socket>();

export const createMatchItem = async (
  socket: Socket,
  matchRequest: MatchRequest
): Promise<boolean> => {
  const { user, complexities, categories, languages, timeout } = matchRequest;

  if (userSockets.has(user.id)) {
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
    acceptedMatch: false,
  };

  const result = await sendRabbitMq(matchQueueItem);
  if (!result) {
    socket.emit(MATCH_REQUEST_ERROR);
  }
  return result;
};

export const createMatch = (matchItem1: MatchItem, matchItem2: MatchItem) => {
  const matchId = uuidv4();
  matches[matchId] = {
    item1: matchItem1,
    item2: matchItem2,
    timeout: null,
    accepted: false,
  };

  // check for disconnection? or just send the match (disconnected user will timeout anyway)
  userSockets.get(matchItem1.user.id)!.join(matchId);
  userSockets.get(matchItem2.user.id)!.join(matchId);
  io.to(matchId).emit(MATCH_FOUND, {
    matchId: matchId,
    user1: matchItem1.user,
    user2: matchItem2.user,
  });
};

export const handleMatchAcceptance = (matchId: string) => {
  const match = matches[matchId];
  if (!match) {
    return;
  }

  if (match.accepted) {
    io.to(matchId).emit(MATCH_SUCCESSFUL);
  } else {
    match.accepted = true;
  }
};

export const handleRematch = (
  socket: Socket,
  matchId: string,
  rematchRequest: MatchRequest
) => {
  const match = matches[matchId];
  if (match) {
    delete matches[matchId];
    socket.to(matchId).emit(MATCH_UNSUCCESSFUL);
  }

  createMatchItem(socket, rematchRequest);
};

export const handleMatchTermination = (terminatedSocket: Socket) => {
  for (const [uid, socket] of userSockets) {
    if (socket.id === terminatedSocket.id) {
      userSockets.delete(uid);
      break;
    }
  }

  // TODO: no access to rooms
  const matchId = Array.from(terminatedSocket.rooms)[1];
  const match = matches[matchId];
  if (match) {
    delete matches[matchId];
    terminatedSocket.to(matchId).emit(MATCH_UNSUCCESSFUL);
  }
};
