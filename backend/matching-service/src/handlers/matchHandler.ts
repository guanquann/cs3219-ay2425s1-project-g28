import { io } from "../../server";
import { Match, MatchItem, MatchRequest } from "../types/matchTypes";
import { v4 as uuidv4 } from "uuid";
import {
  MATCH_ACCEPTANCE_TIMEOUT,
  MATCH_FOUND,
  MATCH_IN_PROGRESS,
  MATCH_SUCCESSFUL,
  MATCH_TIMEOUT,
  MATCH_UNSUCCESSFUL,
} from "../utils/constants";
import { appendToMatchQueue } from "./queueHandler";
import { Socket } from "socket.io";

const matches: Match = {};

export const createMatchItem = (socket: Socket, matchRequest: MatchRequest) => {
  const { user, complexities, categories, languages, timeout } = matchRequest;

  const matchTimeout = setTimeout(() => {
    socket.emit(MATCH_TIMEOUT);
  }, timeout * 1000);

  const matchQueueItem: MatchItem = {
    socket: socket,
    user: user,
    complexities: complexities,
    categories: categories,
    languages: languages,
    timeout: matchTimeout,
    acceptedMatch: false,
  };

  const result = appendToMatchQueue(matchQueueItem);
  if (!result) {
    socket.emit(MATCH_IN_PROGRESS);
  }
};

export const createMatch = (matchItems: MatchItem[]) => {
  const matchItem1 = matchItems[0];
  const matchItem2 = matchItems[1];

  clearTimeout(matchItem1.timeout);
  clearTimeout(matchItem2.timeout);

  const matchId = uuidv4();
  matches[matchId] = {
    item1: matchItem1,
    item2: matchItem2,
    timeout: null,
    accepted: false,
  };

  matchItem1.socket.join(matchId);
  matchItem2.socket.join(matchId);
  io.to(matchId).emit(MATCH_FOUND, {
    matchId: matchId,
    user1: matchItem1.user,
    user2: matchItem2.user,
  });
};

export const setMatchTimeout = (matchId: string) => {
  const match = matches[matchId];
  if (!match) {
    return;
  }

  const timeout = setTimeout(() => {
    io.to(matchId).emit(MATCH_UNSUCCESSFUL);
    delete matches[matchId];
  }, MATCH_ACCEPTANCE_TIMEOUT);

  match.timeout = timeout;
};

export const handleMatchAcceptance = (matchId: string) => {
  const match = matches[matchId];
  if (!match) {
    return;
  }

  if (match.accepted) {
    clearTimeout(match.timeout!);
    io.to(matchId).emit(MATCH_SUCCESSFUL);
    delete matches[matchId];
  } else {
    match.accepted = true;
  }
};

export const handleMatchDecline = (matchId: string) => {
  const match = matches[matchId];
  if (!match) {
    return;
  }

  clearTimeout(match.timeout!);
  io.to(matchId).emit(MATCH_UNSUCCESSFUL);
  delete matches[matchId];
};

export const isUserMatched = (userId: string): boolean => {
  return !!Object.values(matches).find(
    (match) => match.item1.user.id === userId || match.item2.user.id === userId
  );
};
