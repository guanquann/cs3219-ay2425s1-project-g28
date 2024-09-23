import express from "express";
import {
  createQuestion,
  deleteQuestion,
  createImageLink,
  updateQuestion,
  readQuestionsList,
  readQuestionIndiv,
  readCategories,
} from "../controllers/questionController.ts";

const router = express.Router();

router.post("/questions", createQuestion);

router.post("/questions/images", createImageLink);

router.put("/questions/:id", updateQuestion);

router.get("/questions/categories", readCategories);

router.get("/questions", readQuestionsList);

router.get("/questions/:id", readQuestionIndiv);

router.delete("/questions/:id", deleteQuestion);

export default router;
