import { NextFunction, Request, Response } from "express";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../app";
import Question from "../src/models/Question";
import {
  QN_NOT_FOUND_MESSAGE,
  SERVER_ERROR_MESSAGE,
} from "../src/utils/constants";

const request = supertest(app);

const BASE_URL = "/api/questions";

faker.seed(0);

jest.mock("../src/middlewares/basicAccessControl", () => ({
  verifyAdminToken: jest.fn((res: Request, req: Response, next: NextFunction) =>
    next(),
  ),
}));

describe("Question routes", () => {
  it("Delete existing question", async () => {
    const title = faker.lorem.lines(1);
    const complexity = "Easy";
    const categories = ["Algorithms"];
    const description = faker.lorem.lines();
    const newQuestion = new Question({
      title,
      complexity,
      category: categories,
      description,
    });
    await newQuestion.save();
    const res = await request.delete(`${BASE_URL}/${newQuestion.id}`);
    expect(res.status).toBe(200);
  });

  it("Delete non-existing question with invalid object id", async () => {
    const res = await request.delete(`${BASE_URL}/blah`);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe(SERVER_ERROR_MESSAGE);
  });

  it("Delete non-existing question with valid object id", async () => {
    const res = await request.delete(`${BASE_URL}/66f77e9f27ab3f794bdae664`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe(QN_NOT_FOUND_MESSAGE);
  });
});
