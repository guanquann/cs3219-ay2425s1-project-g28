import amqplib, { Connection } from "amqplib";
import dotenv from "dotenv";
import { matchUsers, matchUsersInQueue } from "../src/utils/mq_utils";
import { MatchRequestItem } from "../src/handlers/matchHandler";

dotenv.config();

let mrConnection: Connection;
const queue = "match_requests";

let mrConnectionNew: Connection;
const queues: string[] = [];

enum Complexities {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

enum Categories {
  STRINGS = "Strings",
  ALGORITHMS = "Algorithms",
  DATA_STRUCTURES = "Data Structures",
  BIT_MANIPULATION = "Bit Manipulation",
  RECURSION = "Recursion",
  DYNAMIC_PROGRAMMING = "Dynamic Programming",
  ARRAYS = "Arrays",
  TREE = "Tree",
}

enum LANGUAGES {
  PYTHON = "Python",
  JAVA = "Java",
  C = "C",
}

export const pendingRequestsPerQueue = new Map<
  string,
  Map<string, MatchRequestItem>
>();

const initQueueNames = () => {
  for (const complexity of Object.values(Complexities)) {
    for (const category of Object.values(Categories)) {
      for (const language of Object.values(LANGUAGES)) {
        queues.push(`${complexity}_${category}_${language}`);
      }
    }
  }
};

export const connectToRabbitMq = async () => {
  try {
    initQueueNames();
    mrConnectionNew = await amqplib.connect(`${process.env.RABBITMQ_ADDR}`);
    for (const queue of queues) {
      await setUpQueue(queue);
      pendingRequestsPerQueue.set(queue, new Map<string, MatchRequestItem>());
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const setUpQueue = async (queueName: string) => {
  const consumerChannel = await mrConnectionNew.createChannel();
  await consumerChannel.assertQueue(queueName);

  consumerChannel.consume(queueName, (msg) => {
    console.log(`consume from queue: ${queueName}`);
    if (msg !== null) {
      matchUsersInQueue(queueName, msg.content.toString());
      consumerChannel.ack(msg);
    }
  });
};

export const sendToQueue = async (data: MatchRequestItem) => {
  try {
    const queueName = `${data.complexities[0]}_${data.categories[0]}_${data.languages[0]}`;
    const senderChannel = await mrConnectionNew.createChannel();
    senderChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// ----------------

export const connectRabbitMq = async () => {
  try {
    mrConnection = await amqplib.connect(`${process.env.RABBITMQ_ADDR}`);
    const consumerChannel = await mrConnection.createChannel();
    await consumerChannel.assertQueue(queue);

    consumerChannel.consume(queue, (msg) => {
      if (msg !== null) {
        matchUsers(msg.content.toString());
        consumerChannel.ack(msg);
      }
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const sendRabbitMq = async (
  data: MatchRequestItem
): Promise<boolean> => {
  try {
    const senderChannel = await mrConnection.createChannel();
    senderChannel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
