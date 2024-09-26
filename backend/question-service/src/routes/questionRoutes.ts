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

router.post("/", createQuestion);

router.post("/images", createImageLink);

router.put("/:id", updateQuestion);

router.get("/categories", readCategories);

router.get("/", readQuestionsList);

router.get("/:id", readQuestionIndiv);

router.delete("/:id", deleteQuestion);

export default router;
