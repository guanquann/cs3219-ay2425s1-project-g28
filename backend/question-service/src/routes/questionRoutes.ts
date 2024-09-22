import express from "express";
import {
  createQuestion,
  updateQuestion,
  readQuestionsList,
  readQuestionIndiv,
} from "../controllers/questionController.ts";

const router = express.Router();

router.post("/questions", createQuestion);

router.put("/questions/:id", updateQuestion);

router.get("/questions", readQuestionsList);

router.get("/questions/:id", readQuestionIndiv);

export default router;
