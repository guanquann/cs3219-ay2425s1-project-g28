import amqplib, { Connection } from "amqplib";
import dotenv from "dotenv";
import { matchUsers } from "../utils/mq_utils";

dotenv.config();

let mrConnection: Connection;
const queue = "match_requests";

export const connectRabbitMq = async () => {
  try {
    mrConnection = await amqplib.connect(`${process.env.RABBITMQ_ADDR}`);
    const consumerChannel = await mrConnection.createChannel();
    await consumerChannel.assertQueue(queue);

    consumerChannel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          await matchUsers(msg.content.toString());
        } catch (error) {
          console.error(error);
        }
        consumerChannel.ack(msg);
      }
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

type MatchRequestMessage = {
  userId: string;
  categories: string[] | string;
  complexities: string[] | string;
  sentTimestamp: number;
  ttlInSecs: number;
};

export const sendRabbitMq = async (data: MatchRequestMessage) => {
  try {
    const senderChannel = await mrConnection.createChannel();
    senderChannel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send match request");
  }
};
