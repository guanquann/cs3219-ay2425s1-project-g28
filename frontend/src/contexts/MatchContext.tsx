/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchSocket } from "../utils/matchSocket";
import { minMatchTimeout, USE_AUTH_ERROR_MESSAGE } from "../utils/constants";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

type MatchUser = {
  id: string;
  username: string;
  profile?: string;
};

type MatchCriteria = {
  complexities: string[];
  categories: string[];
  languages: string[];
  timeout: number;
};

enum MatchEvents {
  MATCH_REQUEST = "match_request",
  MATCH_REQUEST_ERROR = "match_request_error",
  MATCH_FOUND = "match_found",
  MATCH_IN_PROGRESS = "match_in_progress",
  MATCH_ACCEPTED = "match_accepted",
  REMATCH_REQUEST = "rematch_request",
  MATCH_SUCCESSFUL = "match_successful",
  MATCH_UNSUCCESSFUL = "match_unsuccessful",

  SOCKET_DISCONNECT = "disconnect",
  SOCKET_CLIENT_DISCONNECT = "io client disconnect",
  SOCKET_RECONNECT_SUCCESS = "reconnect",
  SOCKET_RECONNECT_FAILED = "reconnect_failed",
}

type MatchContextType = {
  closeConnection: (path: string) => void;
  findMatch: (
    complexities: string[],
    categories: string[],
    languages: string[],
    timeout: number
  ) => void;
  retryMatch: () => void;
  acceptMatch: () => void;
  rematch: () => void;
  stopMatch: () => void;
  matchUser: MatchUser | null;
  matchCriteria: MatchCriteria;
  matchId: string | null;
  partner: MatchUser | null;
};

const MatchContext = createContext<MatchContextType | null>(null);

const MatchProvider: React.FC<{ children?: React.ReactNode }> = (props) => {
  const { children } = props;
  const navigate = useNavigate();

  const auth = useAuth();
  if (!auth) {
    throw new Error(USE_AUTH_ERROR_MESSAGE);
  }
  const { user } = auth;
  const [matchUser, _setMatchUser] = useState<MatchUser | null>(
    user
      ? {
          id: user.id,
          username: user.username,
          profile: user.profilePictureUrl,
        }
      : null
  );

  const [matchCriteria, setMatchCriteria] = useState<MatchCriteria>({
    complexities: [],
    categories: [],
    languages: [],
    timeout: minMatchTimeout,
  });
  const [matchId, setMatchId] = useState<string | null>(null);
  const [partner, setPartner] = useState<MatchUser | null>(null);

  const closeConnection = (path: string) => {
    matchSocket.removeAllListeners();
    matchSocket.disconnect();
    setMatchCriteria({
      complexities: [],
      categories: [],
      languages: [],
      timeout: minMatchTimeout,
    });
    setMatchId(null);
    setPartner(null);
    navigate(path, { replace: true });
  };

  const openConnection = () => {
    initSocketListeners();
    matchSocket.connect();
  };

  const initSocketListeners = () => {
    if (!matchSocket.hasListeners(MatchEvents.MATCH_FOUND)) {
      matchSocket.on(MatchEvents.MATCH_FOUND, ({ matchId, user1, user2 }) => {
        setMatchId(matchId);
        matchUser?.id === user1.id ? setPartner(user2) : setPartner(user1);
      });
    }

    if (!matchSocket.hasListeners(MatchEvents.MATCH_IN_PROGRESS)) {
      matchSocket.on(MatchEvents.MATCH_IN_PROGRESS, () => {
        toast.error("You can only have 1 match at a time!");
      });
    }

    if (!matchSocket.hasListeners(MatchEvents.MATCH_SUCCESSFUL)) {
      matchSocket.on(MatchEvents.MATCH_SUCCESSFUL, () => {
        navigate("/collaboration", { replace: true });
      });
    }

    if (!matchSocket.hasListeners(MatchEvents.MATCH_UNSUCCESSFUL)) {
      matchSocket.on(MatchEvents.MATCH_UNSUCCESSFUL, () => {
        toast.error("Matching unsuccessful!");
        closeConnection("/home");
      });
    }

    if (!matchSocket.hasListeners(MatchEvents.MATCH_REQUEST_ERROR)) {
      matchSocket.on(MatchEvents.MATCH_REQUEST_ERROR, () => {
        toast.error("Error sending match request! Please try again later.");
      });
    }

    if (!matchSocket.hasListeners(MatchEvents.SOCKET_DISCONNECT)) {
      matchSocket.on(MatchEvents.SOCKET_DISCONNECT, (reason) => {
        if (reason !== MatchEvents.SOCKET_CLIENT_DISCONNECT) {
          toast.error("Connection error! Reconnecting...");
        }
      });
    }

    if (!matchSocket.io.hasListeners(MatchEvents.SOCKET_RECONNECT_SUCCESS)) {
      matchSocket.io.on(MatchEvents.SOCKET_RECONNECT_SUCCESS, () => {
        toast.success("Reconnected!");
        initSocketListeners(); // TODO: check
      });
    }

    if (!matchSocket.io.hasListeners(MatchEvents.SOCKET_RECONNECT_FAILED)) {
      matchSocket.io.on(MatchEvents.SOCKET_RECONNECT_FAILED, () => {
        console.log("Oops, something went wrong! Please try again later.");
      });
    }
  };

  const findMatch = (
    complexities: string[],
    categories: string[],
    languages: string[],
    timeout: number
  ) => {
    openConnection();
    matchSocket.emit(
      MatchEvents.MATCH_REQUEST,
      {
        user: matchUser,
        complexities: complexities,
        categories: categories,
        languages: languages,
        timeout: timeout,
      },
      (result: boolean) => {
        if (result) {
          setMatchCriteria({
            complexities,
            categories,
            languages,
            timeout,
          });
          navigate("/matching", { replace: true });
        }
      }
    );
  };

  const retryMatch = () => {
    findMatch(
      matchCriteria.complexities,
      matchCriteria.categories,
      matchCriteria.languages,
      matchCriteria.timeout
    );
  };

  const acceptMatch = () => {
    matchSocket.emit(MatchEvents.MATCH_ACCEPTED, matchId);
  };

  const rematch = () => {
    const rematchRequest = {
      user: matchUser,
      complexities: matchCriteria.complexities,
      categories: matchCriteria.categories,
      languages: matchCriteria.languages,
      timeout: matchCriteria.timeout,
    };
    matchSocket.emit(MatchEvents.REMATCH_REQUEST, matchId, rematchRequest);

    setMatchId(null);
    setPartner(null);
    navigate("/matching", { replace: true });
  };

  const stopMatch = () => {
    closeConnection("/home");
  };

  return (
    <MatchContext.Provider
      value={{
        closeConnection,
        findMatch,
        retryMatch,
        acceptMatch,
        rematch,
        stopMatch,
        matchUser,
        matchCriteria,
        matchId,
        partner,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => useContext(MatchContext);

export default MatchProvider;
