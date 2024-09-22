import express from "express";
import {
  createQuestion,
  createImageLink,
  updateQuestion,
} from "../controllers/questionController.ts";

const router = express.Router();

router.post("/questions", createQuestion);

router.post("/questions/images", createImageLink);

router.put("/questions/:id", updateQuestion);

export default router;
