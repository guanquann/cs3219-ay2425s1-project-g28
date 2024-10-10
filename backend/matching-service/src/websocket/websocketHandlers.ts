import { Socket } from "socket.io";

interface MatchRequest {
  user: string;
  complexities: string[];
  categories: string[];
  languages: string[];
  timeout: number;
}

interface MatchQueueItem {
  socket: Socket;
  user: string;
  complexities: string[];
  categories: string[];
  languages: string[];
  timeout: NodeJS.Timeout;
  acceptedMatch: boolean;
}

const matchedPairs: { user1: MatchQueueItem; user2: MatchQueueItem }[] = [];

export const handleMatchRequest = (socket: Socket) => {
  socket.on("match_request", (matchRequest: MatchRequest) => {
    const { user, complexities, categories, languages, timeout } = matchRequest;

    const matchTimeout = setTimeout(() => {
      socket.emit("match_timeout");
    }, timeout * 1000);

    const matchQueueItem: MatchQueueItem = {
      socket: socket,
      user: user,
      complexities: complexities,
      categories: categories,
      languages: languages,
      timeout: matchTimeout,
      acceptedMatch: false,
    };

    // TODO: add to queue, don't match user if matchQueueItem.socket.disconnected
    // appendToMatchQueue(matchQueueItem);

    // TODO: in queue service, if match is found
    const partner: MatchQueueItem = {
      socket: socket,
      user: "OtherUser123",
      complexities: complexities,
      categories: categories,
      languages: languages,
      timeout: matchTimeout,
      acceptedMatch: false,
    };
    clearTimeout(matchQueueItem.timeout);
    clearTimeout(partner.timeout);
    matchedPairs.push({ user1: matchQueueItem, user2: partner });
    matchQueueItem.socket.emit("match_found", partner.user);
    partner.socket.emit("match_found", matchQueueItem.user);

    const acceptanceTimeout = setTimeout(() => {
      matchQueueItem.socket.emit("match_unsuccessful");
      partner.socket.emit("match_unsuccessful");
    }, 10 * 1000);
    matchQueueItem.timeout = acceptanceTimeout;
    partner.timeout = acceptanceTimeout;
  });

  socket.on("match_accepted", () => {
    const matchedPair = matchedPairs.find(
      (pair) =>
        pair.user1.socket.id === socket.id || pair.user2.socket.id === socket.id
    )!;

    const [matchQueueItem, partner] =
      matchedPair.user1.socket.id === socket.id
        ? [matchedPair.user1, matchedPair.user2]
        : [matchedPair.user2, matchedPair.user1];

    clearTimeout(matchQueueItem.timeout);

    if (partner.acceptedMatch) {
      socket.emit("match_successful", partner.user);
    } else {
      matchQueueItem.acceptedMatch = true;
    }
  });

  socket.on("match_declined", () => {
    const index = matchedPairs.findIndex(
      (pair) =>
        pair.user1.socket.id === socket.id || pair.user2.socket.id === socket.id
    );

    if (index === -1) {
      socket.emit("match_unsuccessful");
      return;
    }

    const matchedPair = matchedPairs.splice(index, 1)[0];

    const [matchQueueItem, partner] =
      matchedPair.user1.socket.id === socket.id
        ? [matchedPair.user1, matchedPair.user2]
        : [matchedPair.user2, matchedPair.user1];

    clearTimeout(matchQueueItem.timeout);
    clearTimeout(partner.timeout);
    socket.disconnect();
    partner.socket.emit("match_unsuccessful");
  });
};
