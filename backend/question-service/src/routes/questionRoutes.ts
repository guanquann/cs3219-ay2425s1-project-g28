import express from "express";
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "../controllers/questionController.ts";

const router = express.Router();

router.post("/questions", createQuestion);

router.put("/questions/:id", updateQuestion);

router.delete("/questions/:id", deleteQuestion);

export default router;
