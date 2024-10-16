import { v4 as uuidv4 } from "uuid";
import { sendRabbitMq } from "../../config/rabbitmq";
import { sendMatchFound } from "./websocketHandler";

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

export interface MatchRequestItem {
  user: MatchUser;
  complexities: string[];
  categories: string[];
  languages: string[];
  sentTimestamp: number;
  ttlInSecs: number;
}

const matches = new Map<string, Match>();

export const sendMatchRequest = async (
  matchRequest: MatchRequest
): Promise<boolean> => {
  const { user, complexities, categories, languages, timeout } = matchRequest;
  const matchItem: MatchRequestItem = {
    user: user,
    complexities: complexities,
    categories: categories,
    languages: languages,
    sentTimestamp: Date.now(),
    ttlInSecs: timeout,
  };

  const sent = await sendRabbitMq(matchItem);
  return sent;
};

export const createMatch = (
  requestItem1: MatchRequestItem,
  requestItem2: MatchRequestItem
) => {
  const matchId = uuidv4();
  matches.set(matchId, {
    uid1: requestItem1.user.id,
    uid2: requestItem2.user.id,
    accepted: false,
  });

  sendMatchFound(matchId, requestItem1, requestItem2);
};

export const handleMatchAccept = (matchId: string): boolean => {
  const match = matches.get(matchId);
  if (!match) {
    return false;
  }

  const partnerAccepted = match.accepted;
  matches.set(matchId, { ...match, accepted: true });
  return partnerAccepted;
};

export const handleMatchDelete = (matchId: string): boolean =>
  matches.delete(matchId);

export const getMatchIdByUid = (uid: string): string | null => {
  for (const [matchId, match] of matches) {
    if (match.uid1 === uid || match.uid2 === uid) {
      return matchId;
    }
  }
  return null;
};
