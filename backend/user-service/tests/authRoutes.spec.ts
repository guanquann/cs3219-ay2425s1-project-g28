import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../app";
import UserModel from "../model/user-model";

const request = supertest(app);

const AUTH_BASE_URL = "/api/auth";

faker.seed(0);

const insertUser = async () => {
  const username = faker.internet.userName();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  const password = "strongPassword@123";
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await new UserModel({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
  }).save();
  return { email, password };
};

describe("Auth routes", () => {
  it("Login", async () => {
    const credentials = await insertUser();
    const res = await request.post(`${AUTH_BASE_URL}/login`).send(credentials);
    expect(res.status).toBe(200);
  });
});
