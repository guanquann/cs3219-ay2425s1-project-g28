import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
<<<<<<< HEAD

  mongoose.connect(mongoUri, {});
=======
  
  await mongoose.connect(mongoUri, {});
>>>>>>> development
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
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});
