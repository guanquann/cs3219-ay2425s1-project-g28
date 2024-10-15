import {
  createMatch,
  hasUserDisconnected,
  MatchItem,
} from "../handlers/matchHandler";

const matchingRequests = new Map<string, MatchItem>();

export const matchUsers = (newRequest: string) => {
  const newRequestJson = JSON.parse(newRequest) as MatchItem;
  const newRequestUid = newRequestJson.user.id;
  for (const [uid, pendingRequest] of matchingRequests) {
    if (
      isExpired(pendingRequest) ||
      hasUserDisconnected(uid) ||
      uid === newRequestUid
    ) {
      matchingRequests.delete(uid);
      continue;
    }
    if (isExpired(newRequestJson) || hasUserDisconnected(newRequestUid)) {
      return;
    }

    if (isMatch(newRequestJson, pendingRequest)) {
      matchingRequests.delete(uid);
      createMatch(pendingRequest, newRequestJson);
      console.log(`matched ${uid} and ${newRequestUid}`);
      return;
    }
  }
  matchingRequests.set(newRequestUid, newRequestJson);
};

const isExpired = (data: MatchItem): boolean => {
  return Date.now() - data.sentTimestamp >= data.ttlInSecs * 1000;
};

const isMatch = (req1: MatchItem, req2: MatchItem): boolean => {
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
