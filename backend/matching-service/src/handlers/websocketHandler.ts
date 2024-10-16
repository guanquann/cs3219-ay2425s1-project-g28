import { Socket } from "socket.io";
import {
  sendMatchRequest,
  handleMatchAccept,
  MatchRequest,
  handleMatchDelete,
  getMatchIdByUid,
  MatchUser,
  getMatchByUid,
} from "./matchHandler";
import { io } from "../../server";

enum MatchEvents {
  // Receive
  MATCH_REQUEST = "match_request",
  CANCEL_MATCH_REQUEST = "cancel_match_request",
  MATCH_ACCEPT_REQUEST = "match_accept_request",
  MATCH_DECLINE_REQUEST = "match_decline_request",
  REMATCH_REQUEST = "rematch_request",
  MATCH_END_REQUEST = "match_end_request",
  MATCH_STATUS_REQUEST = "match_status_request",

  USER_CONNECTED = "user_connected",
  USER_DISCONNECTED = "user_disconnected",
  SOCKET_DISCONNECT = "disconnect",
  SOCKET_CLIENT_DISCONNECT = "client namespace disconnect",

  // Send
  MATCH_FOUND = "match_found",
  MATCH_SUCCESSFUL = "match_successful",
  MATCH_UNSUCCESSFUL = "match_unsuccessful",
  MATCH_ENDED = "match_ended",
  MATCH_REQUEST_EXISTS = "match_request_exists",
  MATCH_REQUEST_ERROR = "match_request_error",
}

interface UserConnection {
  socket: Socket;
  connectionTimeout?: NodeJS.Timeout;
  isDisconnecting: boolean;
}

const connectionDelay = 3000; // time window to allow for page navigation / refresh
const userConnections = new Map<string, UserConnection>();

export const handleWebsocketMatchEvents = (socket: Socket) => {
  socket.removeAllListeners();

  socket.on(MatchEvents.USER_CONNECTED, (uid: string) => {
    console.log(`uid: ${uid} and socket id: ${socket.id}`);
    clearTimeout(userConnections.get(uid)?.connectionTimeout);
    if (userConnections.has(uid)) {
      const matchId = getMatchIdByUid(uid);
      if (matchId) {
        socket.join(matchId);
      }
    }
    userConnections.set(uid, { socket: socket, isDisconnecting: false });
  });

  socket.on(MatchEvents.USER_DISCONNECTED, (uid: string) => {
    if (!userConnections.has(uid)) {
      return;
    }

    clearTimeout(userConnections.get(uid)?.connectionTimeout);

    const connectionTimeout = setTimeout(() => {
      endMatchOnUserDisconnect(socket, uid);
      socket.disconnect();
    }, connectionDelay);

    userConnections.set(uid, {
      socket: socket,
      connectionTimeout: connectionTimeout,
      isDisconnecting: true,
    });
  });

  socket.on(
    MatchEvents.MATCH_REQUEST,
    async (
      matchRequest: MatchRequest,
      callback: (requested: boolean) => void
    ) => {
      const uid = matchRequest.user.id;
      if (isUserConnected(uid) && !userConnections.get(uid)?.isDisconnecting) {
        socket.emit(MatchEvents.MATCH_REQUEST_EXISTS);
        callback(false);
        return;
      }

      userConnections.set(uid, { socket: socket, isDisconnecting: false });

      const sent = await sendMatchRequest(matchRequest);
      if (!sent) {
        socket.emit(MatchEvents.MATCH_REQUEST_ERROR);
        userConnections.delete(uid);
        socket.disconnect();
      }
      callback(sent);
    }
  );

  socket.on(MatchEvents.CANCEL_MATCH_REQUEST, (uid: string) => {
    userConnections.delete(uid);
  });

  socket.on(MatchEvents.MATCH_ACCEPT_REQUEST, (matchId: string) => {
    const partnerAccepted = handleMatchAccept(matchId);
    if (partnerAccepted) {
      io.to(matchId).emit(MatchEvents.MATCH_SUCCESSFUL);
    }
  });

  socket.on(
    MatchEvents.MATCH_DECLINE_REQUEST,
    (uid: string, matchId: string, isTimeout: boolean) => {
      userConnections.delete(uid);
      const matchDeleted = handleMatchDelete(matchId);
      if (matchDeleted && !isTimeout) {
        socket.to(matchId).emit(MatchEvents.MATCH_UNSUCCESSFUL);
      }
    }
  );

  socket.on(
    MatchEvents.REMATCH_REQUEST,
    async (
      matchId: string,
      rematchRequest: MatchRequest,
      callback: (result: boolean) => void
    ) => {
      const matchDeleted = handleMatchDelete(matchId);
      if (matchDeleted) {
        socket.to(matchId).emit(MatchEvents.MATCH_UNSUCCESSFUL);
      }

      const sent = await sendMatchRequest(rematchRequest);
      if (!sent) {
        socket.emit(MatchEvents.MATCH_REQUEST_ERROR);
      }
      callback(sent);
    }
  );

  socket.on(MatchEvents.MATCH_END_REQUEST, (uid: string, matchId: string) => {
    userConnections.delete(uid);
    const matchDeleted = handleMatchDelete(matchId);
    if (matchDeleted) {
      socket.to(matchId).emit(MatchEvents.MATCH_ENDED);
    }
  });

  socket.on(
    MatchEvents.MATCH_STATUS_REQUEST,
    (
      uid: string,
      callback: (match: { matchId: string; partner: MatchUser } | null) => void
    ) => {
      const match = getMatchByUid(uid);
      callback(match);
    }
  );

  socket.on(MatchEvents.SOCKET_DISCONNECT, () => {
    for (const [uid, userConnection] of userConnections) {
      if (userConnection.socket.id === socket.id) {
        if (!userConnections.get(uid)?.connectionTimeout) {
          endMatchOnUserDisconnect(socket, uid);
        }
        break;
      }
    }
  });
};

export const sendMatchFound = (
  matchId: string,
  matchUser1: MatchUser,
  matchUser2: MatchUser
) => {
  userConnections.get(matchUser1.id)?.socket.join(matchId);
  userConnections.get(matchUser2.id)?.socket.join(matchId);
  io.to(matchId).emit(MatchEvents.MATCH_FOUND, {
    matchId: matchId,
    user1: matchUser1,
    user2: matchUser2,
  });
};

export const isUserConnected = (uid: string) => {
  return userConnections.has(uid);
};

const endMatchOnUserDisconnect = (socket: Socket, uid: string) => {
  userConnections.delete(uid);
  const matchId = getMatchIdByUid(uid);
  if (matchId) {
    const matchDeleted = handleMatchDelete(matchId);
    if (matchDeleted) {
      socket.to(matchId).emit(MatchEvents.MATCH_UNSUCCESSFUL); // on matching page
      socket.to(matchId).emit(MatchEvents.MATCH_ENDED); // on collab page
    }
  }
};
