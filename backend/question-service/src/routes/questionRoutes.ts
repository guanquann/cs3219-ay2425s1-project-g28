import express from "express";
import {
  createQuestion,
  deleteQuestion,
  createImageLink,
  updateQuestion,
} from "../controllers/questionController.ts";

const router = express.Router();

router.post("/questions", createQuestion);

router.post("/questions/images", createImageLink);

router.put("/questions/:id", updateQuestion);

router.delete("/questions/:id", deleteQuestion);

export default router;
