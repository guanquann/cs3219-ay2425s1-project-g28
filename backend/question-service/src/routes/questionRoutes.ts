import express from "express";
import {
  createQuestion,
  updateQuestion,
} from "../controllers/questionController.ts";

const router = express.Router();

router.post("/questions", createQuestion);

router.put("/questions/:id", updateQuestion);

export default router;
