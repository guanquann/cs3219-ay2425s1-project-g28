import mongoose from "mongoose";
import redisClient from "../config/redis";

beforeAll(async () => {
  // mongo = await MongoMemoryServer.create();
  // const mongoUri = mongo.getUri();

  // if (mongoose.connection.readyState !== 0) {
  //   await mongoose.disconnect();
  // }

  const mongoUri =
    process.env.MONGO_URI_TEST || "mongodb://mongo:mongo@mongo:27017/";

  await mongoose.connect(mongoUri, {});
  await redisClient.connect();
  redisClient.on("error", (err) => console.log(`Error: ${err}`));
});

afterEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // if (mongo) {
  //   await mongo.stop();
  // }

  await mongoose.connection.close();
  await redisClient.disconnect();
});
