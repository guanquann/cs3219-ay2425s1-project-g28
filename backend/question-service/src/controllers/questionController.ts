import { Request, Response } from "express";
import Question from "../models/Question.ts";
import { checkIsExistingQuestion } from "../utils/utils.ts";
import {
  DUPLICATE_QUESTION_RESPONSE_MESSAGE,
  QN_DESC_EXCEED_CHAR_LIMIT_RESPONSE_MESSAGE,
  QN_DESC_CHAR_LIMIT,
  QN_NOT_FOUND,
  QN_DELETED,
  SERVER_ERROR,
} from "../utils/constants.ts";

export const createQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, complexity, category } = req.body;

    const existingQuestion = await checkIsExistingQuestion(title);
    if (existingQuestion) {
      res.status(400).json({
        message: DUPLICATE_QUESTION_RESPONSE_MESSAGE,
      });
      return;
    }

    if (description.length > QN_DESC_CHAR_LIMIT) {
      res.status(400).json({
        message: QN_DESC_EXCEED_CHAR_LIMIT_RESPONSE_MESSAGE,
      });
      return;
    }

    const newQuestion = new Question({
      title,
      description,
      complexity,
      category,
    });

    await newQuestion.save();

    res.status(201).json({
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR, error });
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const currentQuestion = await Question.findById(id);
    if (!currentQuestion) {
      res.status(404).json({ message: QN_NOT_FOUND });
      return;
    }

    const existingQuestion = await checkIsExistingQuestion(title, id);
    if (existingQuestion) {
      res.status(400).json({
        message: DUPLICATE_QUESTION_RESPONSE_MESSAGE,
      });
      return;
    }

    if (description && description.length > QN_DESC_CHAR_LIMIT) {
      res.status(400).json({
        message: QN_DESC_EXCEED_CHAR_LIMIT_RESPONSE_MESSAGE,
      });
      return;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR, error });
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentQuestion = await Question.findById(id);
    if (!currentQuestion) {
      res.status(400).json({ message: QN_NOT_FOUND });
      return;
    }

    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: QN_DELETED });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR, error });
  }
};
