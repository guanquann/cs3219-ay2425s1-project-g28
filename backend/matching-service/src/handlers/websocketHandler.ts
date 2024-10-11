import { Socket } from "socket.io";
import {
  MATCH_ACCEPTED,
  MATCH_DECLINED,
  MATCH_RECEIVED,
  MATCH_REQUEST,
} from "../utils/constants";
import { MatchRequest } from "../types/matchTypes";
import {
  createMatchItem,
  handleMatchAcceptance,
  handleMatchDecline,
  setMatchTimeout,
} from "./matchHandler";

export const handleWebsocketMatchEvents = (socket: Socket) => {
  socket.on(MATCH_REQUEST, (matchRequest: MatchRequest) => {
    createMatchItem(socket, matchRequest);
  });

  socket.on(MATCH_RECEIVED, (matchId: string) => {
    setMatchTimeout(matchId);
  });

  socket.on(MATCH_ACCEPTED, (matchId: string) => {
    handleMatchAcceptance(matchId);
  });

  socket.on(MATCH_DECLINED, (matchId: string) => {
    handleMatchDecline(matchId);
  });
};
