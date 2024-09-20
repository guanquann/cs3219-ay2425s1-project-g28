import mongoose from "mongoose";

import Question from "../models/Question";

export const checkIsExistingQuestion = async (
  title: string,
  idToExcludeFromCheck = "",
) => {
  const objectIdToExclude = idToExcludeFromCheck
    ? new mongoose.Types.ObjectId(idToExcludeFromCheck)
    : null;

  return await Question.findOne({
    title: new RegExp(`^${title}$`, "i"),
    _id: { $ne: objectIdToExclude }, // Exclude current question's ID if provided
  });
};
