import { Request, Response } from "express";
import Question from "../models/Question.ts";
import { checkIsExistingQuestion } from "../utils/utils.ts";
import {
  DUPLICATE_QUESTION_RESPONSE_MESSAGE,
  QN_DESC_EXCEED_CHAR_LIMIT_RESPONSE_MESSAGE,
  QN_DESC_CHAR_LIMIT,
  QN_CREATED,
  QN_NOT_FOUND,
  SERVER_ERROR,
  QN_RETRIEVED,
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
      message: QN_CREATED,
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

export const readQuestionsList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const qnLimit = 10;

    const { currPage } = req.params;
    const currPageInt = parseInt(currPage);

    if (!req.body || Object.keys(req.body).length == 0) {
      const totalQuestions = await Question.countDocuments();
      if (totalQuestions == 0) {
        res.status(404).json({ message: QN_NOT_FOUND });
        return;
      }
      const totalPages = Math.ceil(totalQuestions / qnLimit);

      const currPageQuestions = await Question.find()
        .skip((currPageInt - 1) * qnLimit)
        .limit(qnLimit);

      res.status(200).json({
        message: QN_RETRIEVED,
        pages: totalPages,
        questions: currPageQuestions,
      });
    } else {
      const { title, complexities, categories } = req.body;
      const query: any = {};

      if (title) {
        query.title = { $regex: new RegExp(title, "i") };
      }

      if (complexities && complexities.length > 0) {
        query.complexity = { $in: complexities };
      }

      if (categories && categories.length > 0) {
        query.category = { $in: categories };
      }

      const filteredTotalQuestions = await Question.countDocuments(query);
      if (filteredTotalQuestions == 0) {
        res.status(404).json({ message: QN_NOT_FOUND });
        return;
      }
      const filteredTotalPages = Math.ceil(filteredTotalQuestions / qnLimit);

      const filteredQuestions = await Question.find(query)
        .skip((currPageInt - 1) * qnLimit)
        .limit(qnLimit);

      res.status(200).json({
        message: QN_RETRIEVED,
        pages: filteredTotalPages,
        questions: filteredQuestions,
      });
    }
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR, error });
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
      res.status(404).json({ message: QN_NOT_FOUND });
      return;
    }
    res.status(200).json({
      message: QN_RETRIEVED,
      question: questionDetails,
    });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR, error });
  }
};
