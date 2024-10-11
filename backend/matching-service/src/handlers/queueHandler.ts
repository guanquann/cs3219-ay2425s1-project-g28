import { MatchItem } from "../types/matchTypes";
import { createMatch, isUserMatched } from "./matchHandler";

/* Basic queue set-up for websocket testing (feel free to replace with the actual queueing mechanism) */

const matchQueue: MatchItem[] = [];

setInterval(() => {
  findMatch();
}, 5000);

const findMatch = () => {
  matchQueue.forEach((item) =>
    console.log(`${item.user.username} is ${item.socket.connected}`)
  );
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
  if (
    matchQueue.find(
      (queueItem) =>
        queueItem.user.id === item.user.id && queueItem.socket.connected
    ) ||
    isUserMatched(item.user.id)
  ) {
    return false;
  }

  console.log(item.user.username);
  matchQueue.push(item);
  return true;
};
