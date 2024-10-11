import { MatchItem } from "../types/matchTypes";
import { createMatch } from "./matchHandler";

/* Basic queue set-up for websocket testing (feel free to replace with the actual queueing mechanism) */

const matchQueue: MatchItem[] = [];

setInterval(() => {
  findMatch();
}, 5000);

const findMatch = () => {
  if (matchQueue.length < 2) {
    return;
  }

  const matchedItems = [];
  while (matchedItems.length < 2 && matchQueue.length > 0) {
    const matchItem = matchQueue.shift()!;
    if (matchItem.socket.connected) {
      matchedItems.push(matchItem);
    }
  }

  if (matchedItems.length === 2) {
    createMatch(matchedItems);
  } else {
    matchedItems.reverse().forEach((item) => matchQueue.unshift(item));
  }
};

export const appendToMatchQueue = (item: MatchItem) => {
  if (!matchQueue.find((queueItem) => queueItem.user.id === item.user.id)) {
    matchQueue.push(item);
  }
};
