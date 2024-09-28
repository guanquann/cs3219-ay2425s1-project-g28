import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../app";

const request = supertest(app);

const USER_BASE_URL = "/api/users";

faker.seed(0);

describe("User routes", () => {
  it("Create a user", async () => {
    const username = faker.internet.userName();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const password = "strongPassword@123";
    const res = await request
      .post(USER_BASE_URL)
      .send({ username, firstName, lastName, email, password });
    expect(res.status).toBe(201);
  });
});
