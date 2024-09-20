import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Question from "../models/Question.ts";
import { checkIsExistingQuestion } from "../utils/utils.ts";
import {
  DUPLICATE_QUESTION_RESPONSE_MESSAGE,
  QN_DESC_EXCEED_CHAR_LIMIT_RESPONSE_MESSAGE,
  QN_DESC_CHAR_LIMIT,
} from "../utils/constants.ts";

import { bucket, uploadFileToFirebase } from "../../config/firebase";
import { upload } from "../../config/multer";

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
    res.status(500).json({ message: "Server error", error });
  }
};

export const createImageLink = async (
  req: Request,
  res: Response,
): Promise<void> => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to upload images", error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    try {
      const files = req.files as Express.Multer.File[];
      const uploadPromises = files.map((file) => uploadFileToFirebase(file));
      const imageUrls = await Promise.all(uploadPromises);
      res.status(200).json({ imageUrls });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
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
      res.status(404).json({ message: "Question not found" });
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
    res.status(500).json({ message: "Server error", error });
  }
};
