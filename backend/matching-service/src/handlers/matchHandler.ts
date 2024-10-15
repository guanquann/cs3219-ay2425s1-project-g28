import { io } from "../../server";
import { v4 as uuidv4 } from "uuid";
import {
  MATCH_FOUND,
  MATCH_IN_PROGRESS,
  MATCH_SUCCESSFUL,
  MATCH_ENDED,
  MATCH_REQUEST_ERROR,
  MATCH_NOT_ACCEPTED,
} from "../utils/constants";
import { Socket } from "socket.io";
import { sendRabbitMq } from "../../config/rabbitmq";

interface MatchUser {
  id: string;
  username: string;
  profile?: string;
}

interface Match {
  uid1: string;
  uid2: string;
  accepted: boolean;
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

const matches = new Map<string, Match>();
const userSockets = new Map<string, Socket>();

export const createMatchItem = async (
  socket: Socket,
  matchRequest: MatchRequest,
  isRematch?: boolean
): Promise<boolean> => {
  const { user, complexities, categories, languages, timeout } = matchRequest;

  if (!isRematch && userSockets.has(user.id)) {
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
  const uid1 = matchItem1.user.id;
  const uid2 = matchItem2.user.id;

  const matchId = uuidv4();
  matches.set(matchId, {
    uid1: uid1,
    uid2: uid2,
    accepted: false,
  });

  userSockets.get(uid1)?.join(matchId);
  userSockets.get(uid2)?.join(matchId);
  io.to(matchId).emit(MATCH_FOUND, {
    matchId: matchId,
    user1: matchItem1.user,
    user2: matchItem2.user,
  });
};

export const handleMatchAcceptance = (matchId: string) => {
  const match = matches.get(matchId);
  if (!match) {
    return;
  }

  if (match.accepted) {
    io.to(matchId).emit(MATCH_SUCCESSFUL);
  } else {
    matches.set(matchId, { ...match, accepted: true });
  }
};

const handleMatchDecline = (socket: Socket, matchId: string) => {
  if (matches.delete(matchId)) {
    socket.to(matchId).emit(MATCH_NOT_ACCEPTED);
  }
};

export const handleRematch = async (
  socket: Socket,
  matchId: string,
  rematchRequest: MatchRequest
): Promise<boolean> => {
  handleMatchDecline(socket, matchId);
  return await createMatchItem(socket, rematchRequest, true);
};

export const handleMatchStopRequest = (
  socket: Socket,
  uid: string | undefined,
  matchId: string | null,
  matchPending: boolean,
  isMutual: boolean
) => {
  if (matchId) {
    if (matchPending) {
      handleMatchDecline(socket, matchId);
      return;
    }

    const match = matches.get(matchId);
    if (match) {
      userSockets.delete(match.uid1);
      userSockets.delete(match.uid2);
      matches.delete(matchId);
    }

    if (!isMutual) {
      socket.to(matchId).emit(MATCH_ENDED);
    }
  } else if (uid) {
    userSockets.delete(uid);
  }
};

export const handleUserDisconnect = (disconnectedSocket: Socket) => {
  for (const [uid, socket] of userSockets) {
    if (socket.id === disconnectedSocket.id) {
      userSockets.delete(uid);
      break;
    }
  }
};

export const hasUserDisconnected = (uid: string) => {
  return !userSockets.has(uid);
};
