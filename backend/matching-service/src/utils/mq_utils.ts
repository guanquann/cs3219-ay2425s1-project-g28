import { createMatch, MatchRequestItem } from "../handlers/matchHandler";
import { isUserConnected } from "../handlers/websocketHandler";

const matchingRequests = new Map<string, MatchRequestItem>();

export const matchUsers = (newRequest: string) => {
  const newRequestJson = JSON.parse(newRequest) as MatchRequestItem;
  const newRequestUid = newRequestJson.user.id;
  for (const [uid, pendingRequest] of matchingRequests) {
    if (
      isExpired(pendingRequest) ||
      !isUserConnected(uid) ||
      uid === newRequestUid
    ) {
      matchingRequests.delete(uid);
      continue;
    }
    if (isExpired(newRequestJson) || !isUserConnected(uid)) {
      return;
    }

    if (isMatch(newRequestJson, pendingRequest)) {
      matchingRequests.delete(uid);
      createMatch(pendingRequest, newRequestJson);
      return;
    }
  }
  matchingRequests.set(newRequestUid, newRequestJson);
};

const isExpired = (data: MatchRequestItem): boolean => {
  return Date.now() - data.sentTimestamp >= data.ttlInSecs * 1000;
};

const isMatch = (req1: MatchRequestItem, req2: MatchRequestItem): boolean => {
  const hasCommonCategory = req1.categories.some((elem) =>
    req1.categories.includes(elem)
  );
  const hasCommonComplexity = req1.complexities.some((elem) =>
    req2.complexities.includes(elem)
  );
  const hasCommonLanguage = req1.languages.some((elem) =>
    req2.languages.includes(elem)
  );

  // return hasCommonCategory && hasCommonComplexity && hasCommonLanguage;
  return true;
};
