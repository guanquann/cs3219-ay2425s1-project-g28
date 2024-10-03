import { NextFunction, Request, Response } from "express";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../app";
import Question from "../src/models/Question";
import {
  PAGE_LIMIT_INCORRECT_FORMAT_MESSAGE,
  PAGE_LIMIT_REQUIRED_MESSAGE,
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
  describe("GET /", () => {
    it("Reads existing questions", async () => {
      const qnLimit = 10;
      const res = await request.get(`${BASE_URL}?page=1&qnLimit=${qnLimit}`);
      expect(res.status).toBe(200);
      expect(res.body.questions.length).toBeLessThanOrEqual(qnLimit);
    });

    it("Reads existing questions with title filter", async () => {
      const qnLimit = 10;
      const title = "tree";
      const res = await request.get(
        `${BASE_URL}?page=1&qnLimit=${qnLimit}&title=${title}`,
      );
      expect(res.status).toBe(200);
      expect(res.body.questions.length).toBeLessThanOrEqual(qnLimit);
      for (const qn of res.body.questions) {
        expect(qn.title.toLowerCase()).toContain(title);
      }
    });

    it("Reads existing questions with complexity filter", async () => {
      const qnLimit = 10;
      const complexity = "Easy";
      const res = await request.get(
        `${BASE_URL}?page=1&qnLimit=${qnLimit}&complexities=${complexity}`,
      );
      expect(res.status).toBe(200);
      expect(res.body.questions.length).toBeLessThanOrEqual(qnLimit);
      for (const qn of res.body.questions) {
        expect(qn.complexity).toBe(complexity);
      }
    });

    it("Reads existing questions with category filters", async () => {
      const qnLimit = 10;
      const category = "Algorithms";
      const res = await request.get(
        `${BASE_URL}?page=1&qnLimit=${qnLimit}&categories=${category}`,
      );
      expect(res.status).toBe(200);
      expect(res.body.questions.length).toBeLessThanOrEqual(qnLimit);
      for (const qn of res.body.questions) {
        expect(qn.categories).toContain(category);
      }
    });

    it("Does not read without page", async () => {
      const res = await request.get(`${BASE_URL}?qnLimit=10`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(PAGE_LIMIT_REQUIRED_MESSAGE);
    });

    it("Does not read without qnLimit", async () => {
      const res = await request.get(`${BASE_URL}?page=1`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(PAGE_LIMIT_REQUIRED_MESSAGE);
    });

    it("Does not read with negative page", async () => {
      const res = await request.get(`${BASE_URL}?page=-1&qnLimit=10`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(PAGE_LIMIT_INCORRECT_FORMAT_MESSAGE);
    });

    it("Does not read with negative qnLimit", async () => {
      const res = await request.get(`${BASE_URL}?page=1&qnLimit=-10`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(PAGE_LIMIT_INCORRECT_FORMAT_MESSAGE);
    });
  });

  describe("GET /:id", () => {
    it("Reads existing question", async () => {
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
      const res = await request.get(`${BASE_URL}/${newQuestion.id}`);
      expect(res.status).toBe(200);
      expect(res.body.question.title).toBe(title);
      expect(res.body.question.complexity).toBe(complexity);
      expect(res.body.question.categories).toEqual(categories);
      expect(res.body.question.description).toBe(description);
    });

    it("Does not read non-existing question with invalid object id", async () => {
      const res = await request.get(`${BASE_URL}/blah`);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe(SERVER_ERROR_MESSAGE);
    });

    it("Does not read non-existing question with valid object id", async () => {
      const res = await request.get(`${BASE_URL}/66f77e9f27ab3f794bdae664`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe(QN_NOT_FOUND_MESSAGE);
    });
  });

  describe("GET /categories", () => {
    it("Reads existing question categories", async () => {
      const res = await request.get(`${BASE_URL}/categories`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("categories");
    });
  });

  describe("DELETE /:id", () => {
    it("Deletes existing question", async () => {
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

    it("Does not delete non-existing question with invalid object id", async () => {
      const res = await request.delete(`${BASE_URL}/blah`);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe(SERVER_ERROR_MESSAGE);
    });

    it("Does not delete non-existing question with valid object id", async () => {
      const res = await request.delete(`${BASE_URL}/66f77e9f27ab3f794bdae664`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe(QN_NOT_FOUND_MESSAGE);
    });
  });
});
