import { Request, Response } from "express";
import Question from "../models/Question.ts";
import { checkIsExistingQuestion } from "../utils/utils.ts";
import {
  DUPLICATE_QUESTION_RESPONSE_MESSAGE,
  QN_DESC_EXCEED_CHAR_LIMIT_RESPONSE_MESSAGE,
  QN_DESC_CHAR_LIMIT,
  QN_CREATED_MESSAGE,
  QN_NOT_FOUND_MESSAGE,
  QN_DELETED_MESSAGE,
  SERVER_ERROR_MESSAGE,
  QN_RETRIEVED_MESSAGE,
  PAGE_LIMIT_REQUIRED_MESSAGE,
  PAGE_LIMIT_INCORRECT_FORMAT_MESSAGE,
  CATEGORIES_NOT_FOUND_MESSAGE,
  CATEGORIES_RETRIEVED_MESSAGE,
} from "../utils/constants.ts";

import { upload } from "../../config/multer";
import { uploadFileToFirebase } from "../utils/utils";

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
      message: QN_CREATED_MESSAGE,
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR_MESSAGE, error });
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
      res
        .status(200)
        .json({ message: "Images uploaded successfully", imageUrls });
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
      res.status(404).json({ message: QN_NOT_FOUND_MESSAGE });
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
    res.status(500).json({ message: SERVER_ERROR_MESSAGE, error });
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
      res.status(404).json({ message: QN_NOT_FOUND_MESSAGE });
      return;
    }

    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: QN_DELETED_MESSAGE });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR_MESSAGE, error });
  }
};

interface QnListSearchFilterParams {
  page: string;
  qnLimit: string;
  title?: string;
  complexities?: string | string[];
  categories?: string | string[];
}

export const readQuestionsList = async (
  req: Request<unknown, unknown, unknown, QnListSearchFilterParams>,
  res: Response,
): Promise<void> => {
  try {
    const { page, qnLimit, title, complexities, categories } = req.query;

    if (!page || !qnLimit) {
      res.status(400).json({ message: PAGE_LIMIT_REQUIRED_MESSAGE });
      return;
    }

    const pageInt = parseInt(page, 10);
    const qnLimitInt = parseInt(qnLimit, 10);

    if (pageInt < 1 || qnLimitInt < 1) {
      res.status(400).json({ message: PAGE_LIMIT_INCORRECT_FORMAT_MESSAGE });
      return;
    }

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const query: any = {};

    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }

    if (complexities) {
      query.complexity = {
        $in: Array.isArray(complexities) ? complexities : [complexities],
      };
    }

    if (categories) {
      query.category = {
        $in: Array.isArray(categories) ? categories : [categories],
      };
    }

    const filteredTotalQuestions = await Question.countDocuments(query);
    if (filteredTotalQuestions == 0) {
      res.status(404).json({ message: QN_NOT_FOUND_MESSAGE });
      return;
    }

    const filteredQuestions = await Question.find(query)
      .skip((pageInt - 1) * qnLimitInt)
      .limit(qnLimitInt);

    res.status(200).json({
      message: QN_RETRIEVED_MESSAGE,
      totalQns: filteredTotalQuestions,
      questions: filteredQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR_MESSAGE, error });
  }
};

export const readQuestionIndiv = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const questionDetails = await Question.findById(id);
    if (!questionDetails) {
      res.status(404).json({ message: QN_NOT_FOUND_MESSAGE });
      return;
    }

    res.status(200).json({
      message: QN_RETRIEVED_MESSAGE,
      question: questionDetails,
    });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR_MESSAGE, error });
  }
};

export const readCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const uniqueCats = await Question.distinct("category");
    if (!uniqueCats || uniqueCats.length == 0) {
      res.status(404).json({ message: CATEGORIES_NOT_FOUND_MESSAGE });
    }

    res.status(200).json({
      message: CATEGORIES_RETRIEVED_MESSAGE,
      categories: uniqueCats,
    });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR_MESSAGE, error });
  }
};
