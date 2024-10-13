type MatchRequestMessage = {
  userId: string;
  categories: string[] | string;
  complexities: string[] | string;
  sentTimestamp: number;
  ttlInSecs: number;
};

const matchingRequests = new Map<string, MatchRequestMessage>();

export const matchUsers = async (newRequest: string) => {
  const newRequestJson = JSON.parse(newRequest);
  for (const [uid, pendingRequest] of matchingRequests) {
    if (isExpired(pendingRequest)) {
      matchingRequests.delete(uid);
      continue;
    }
    if (isExpired(newRequestJson)) {
      return;
    }

    if (isMatch(newRequestJson, pendingRequest)) {
      //TODO message websocket
      /*try {
        
      } catch (error) {
        console.log("Failed to send message to websocket:", error);
      }*/
      console.log(`matched ${uid} and ${newRequestJson.userId}`);
      return;
    }
  }
  matchingRequests.set(newRequestJson.userId, newRequestJson);
};

const isExpired = (data: MatchRequestMessage): boolean => {
  return Date.now() - data.sentTimestamp >= data.ttlInSecs * 1000;
};

const isMatch = (
  req1: MatchRequestMessage,
  req2: MatchRequestMessage
): boolean => {
  const cat1 = Array.isArray(req1.categories)
    ? req1.categories
    : [req1.categories];
  const cat2 = Array.isArray(req2.categories)
    ? req2.categories
    : [req2.categories];
  const comp1 = Array.isArray(req1.complexities)
    ? req1.complexities
    : [req1.complexities];
  const comp2 = Array.isArray(req2.complexities)
    ? req2.complexities
    : [req2.complexities];

  const hasCommonCat = cat1.some((elem) => cat2.includes(elem));
  const hasCommonComp = comp1.some((elem) => comp2.includes(elem));

  return hasCommonCat && hasCommonComp;
};
