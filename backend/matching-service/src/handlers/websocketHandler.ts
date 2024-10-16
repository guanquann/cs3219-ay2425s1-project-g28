import { Socket } from "socket.io";
import {
  REMATCH_REQUEST,
  MATCH_REQUEST,
  SOCKET_DISCONNECT,
  USER_CONNECTED,
  USER_DISCONNECTED,
  MATCH_DECLINE_REQUEST,
  MATCH_UNSUCCESSFUL,
  MATCH_SUCCESSFUL,
  MATCH_END_REQUEST,
  MATCH_ENDED,
  MATCH_ACCEPT_REQUEST,
  MATCH_FOUND,
  MATCH_REQUEST_EXISTS,
  MATCH_REQUEST_ERROR,
  CANCEL_MATCH_REQUEST,
} from "../utils/constants";
import {
  sendMatchRequest,
  handleMatchAccept,
  MatchRequest,
  handleMatchDelete,
  MatchRequestItem,
  getMatchIdByUid,
} from "./matchHandler";
import { io } from "../../server";

interface UserConnection {
  socket: Socket;
  connectionTimeout?: NodeJS.Timeout;
}

// TODO: do a match lost due to poor connection?
const connectionDelay = 3000; // time window to allow for page navigation / refresh
const userConnections = new Map<string, UserConnection>();

export const handleWebsocketMatchEvents = (socket: Socket) => {
  socket.removeAllListeners();

  socket.on(USER_CONNECTED, (uid: string) => {
    clearTimeout(userConnections.get(uid)?.connectionTimeout);
    userConnections.set(uid, { socket: socket });
    console.log(`socket: ${socket.id}`);
  });

  socket.on(USER_DISCONNECTED, (uid: string, matchId: string | null) => {
    if (!userConnections.has(uid)) {
      return;
    }

    clearTimeout(userConnections.get(uid)?.connectionTimeout);

    const connectionTimeout = setTimeout(() => {
      endMatchOnUserDisconnect(socket, uid, matchId);
      console.log(`server disconnect connection: ${uid}`);
      socket.disconnect();
    }, connectionDelay); // TODO: Clearing up your previous match (in case user immediately sends a new match request)

    userConnections.set(uid, {
      socket: socket,
      connectionTimeout: connectionTimeout,
    });
  });

  socket.on(
    MATCH_REQUEST,
    async (
      matchRequest: MatchRequest,
      callback: (requested: boolean) => void
    ) => {
      const uid = matchRequest.user.id;
      if (isUserConnected(uid)) {
        socket.emit(MATCH_REQUEST_EXISTS);
        callback(false);
        return;
      }

      userConnections.set(uid, { socket: socket });

      const sent = await sendMatchRequest(matchRequest);
      if (!sent) {
        socket.emit(MATCH_REQUEST_ERROR);
        userConnections.delete(uid);
        socket.disconnect();
      }
      callback(sent);
    }
  );

  socket.on(CANCEL_MATCH_REQUEST, (uid: string) => {
    userConnections.delete(uid);
  });

  socket.on(MATCH_ACCEPT_REQUEST, (matchId: string) => {
    const partnerAccepted = handleMatchAccept(matchId);
    if (partnerAccepted) {
      io.to(matchId).emit(MATCH_SUCCESSFUL);
    }
  });

  socket.on(
    MATCH_DECLINE_REQUEST,
    (uid: string, matchId: string, isTimeout: boolean) => {
      userConnections.delete(uid);
      const matchDeleted = handleMatchDelete(matchId);
      if (matchDeleted && !isTimeout) {
        socket.to(matchId).emit(MATCH_UNSUCCESSFUL);
      }
    }
  );

  socket.on(
    REMATCH_REQUEST,
    async (
      matchId: string,
      rematchRequest: MatchRequest,
      callback: (result: boolean) => void
    ) => {
      const matchDeleted = handleMatchDelete(matchId);
      if (matchDeleted) {
        socket.to(matchId).emit(MATCH_UNSUCCESSFUL);
      }

      const sent = await sendMatchRequest(rematchRequest);
      if (!sent) {
        socket.emit(MATCH_REQUEST_ERROR);
      }
      callback(sent);
    }
  );

  socket.on(MATCH_END_REQUEST, (uid: string, matchId: string) => {
    userConnections.delete(uid);
    const matchDeleted = handleMatchDelete(matchId);
    if (matchDeleted) {
      socket.to(matchId).emit(MATCH_ENDED);
    }
  });

  // TODO: handle client reconnect failure
  socket.on(SOCKET_DISCONNECT, () => {
    for (const [uid, userConnection] of userConnections) {
      if (userConnection.socket.id === socket.id) {
        if (!userConnections.get(uid)?.connectionTimeout) {
          const matchId = getMatchIdByUid(uid);
          endMatchOnUserDisconnect(socket, uid, matchId);
          console.log(`force delete connection: ${uid}`);
        }
        break;
      }
    }
  });
};

export const sendMatchFound = (
  matchId: string,
  requestItem1: MatchRequestItem,
  requestItem2: MatchRequestItem
) => {
  userConnections.get(requestItem1.user.id)?.socket.join(matchId);
  userConnections.get(requestItem2.user.id)?.socket.join(matchId);
  io.to(matchId).emit(MATCH_FOUND, {
    matchId: matchId,
    user1: requestItem1.user,
    user2: requestItem2.user,
  });
};

export const isUserConnected = (uid: string) => {
  return userConnections.has(uid);
};

const endMatchOnUserDisconnect = (
  socket: Socket,
  uid: string,
  matchId: string | null
) => {
  userConnections.delete(uid);
  if (matchId) {
    const matchDeleted = handleMatchDelete(matchId);
    if (matchDeleted) {
      socket.to(matchId).emit(MATCH_UNSUCCESSFUL); // on matching page
      socket.to(matchId).emit(MATCH_ENDED); // on collab page
    }
  }
};
