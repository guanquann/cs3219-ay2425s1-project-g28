import { Request, Response } from "express";
import Question from "../models/Question.ts";

export const createQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, complexity, category } = req.body;

    const existingQuestion = await Question.findOne({
      title: new RegExp(`^${title}$`, "i"),
    });

    if (existingQuestion) {
      res.status(400).json({
        message:
          "Duplicate question: A question with the same title already exists.",
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

export const updateQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedQuestion) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
