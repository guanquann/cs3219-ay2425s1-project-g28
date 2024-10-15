import { Socket } from "socket.io";
import {
  MATCH_ACCEPTED,
  REMATCH_REQUEST,
  MATCH_REQUEST,
  SOCKET_CLIENT_DISCONNECT,
  SOCKET_DISCONNECT,
} from "../utils/constants";
import {
  createMatchItem,
  handleMatchAcceptance,
  handleMatchTermination,
  handleRematch,
  MatchRequest,
} from "./matchHandler";

export const handleWebsocketMatchEvents = (socket: Socket) => {
  socket.on(
    MATCH_REQUEST,
    async (matchRequest: MatchRequest, callback: (result: boolean) => void) => {
      const result = await createMatchItem(socket, matchRequest);
      callback(result);
    }
  );

  socket.on(MATCH_ACCEPTED, (matchId: string) =>
    handleMatchAcceptance(matchId)
  );

  socket.on(
    REMATCH_REQUEST,
    async (
      matchId: string,
      rematchRequest: MatchRequest,
      callback: (result: boolean) => void
    ) => {
      const result = await handleRematch(socket, matchId, rematchRequest);
      callback(result);
    }
  );

  socket.on(SOCKET_DISCONNECT, (reason) => {
    if (reason === SOCKET_CLIENT_DISCONNECT) {
      console.log("Client manually disconnected");
      handleMatchTermination(socket);
    }
  });

  // TODO: handle client reconnect failure
  socket.on(SOCKET_DISCONNECT, (reason) => {
    if (reason === SOCKET_CLIENT_DISCONNECT) {
      console.log("Client manually disconnected");
      handleMatchTermination(socket);
    }
  });
};
