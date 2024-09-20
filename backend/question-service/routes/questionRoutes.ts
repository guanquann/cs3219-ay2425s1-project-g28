import express from "express";
import {
  createQuestion,
  updateQuestion,
} from "../controllers/questionController.ts";

const router = express.Router();

// POST: Create a new question
router.post("/questions", createQuestion);

// PUT: Update a question
router.put("/questions/:id", updateQuestion);

export default router;
