import { Dispatch } from "react";
// import { questionClient } from "../utils/api";

type QuestionDetail = {
  questionId: string;
  title: string;
  description: string;
  complexity: string;
  categories: Array<string>;
};

enum QuestionActionTypes {
  ERROR_FETCHING_SELECTED_QN = "error_fetching_selected_qn",
  VIEW_QUESTION = "view_question",
}

type QuestionActions = {
  type: QuestionActionTypes;
  payload: Array<QuestionDetail> | QuestionDetail | string;
};

type QuestionsState = {
  questions: Array<QuestionDetail>;
  selectedQuestion: QuestionDetail | null;
  selectedQuestionError: string | null;
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const isQuestion = (question: any): question is QuestionDetail => {
  if (!question || typeof question !== "object") {
    return false;
  }

  return (
    typeof question.questionId === "string" &&
    typeof question.title === "string" &&
    typeof question.description === "string" &&
    typeof question.complexity === "string" &&
    Array.isArray(question.categories) &&
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (question.categories as Array<any>).every(
      (value) => typeof value === "string"
    )
  );
};

export const initialState: QuestionsState = {
  questions: [],
  selectedQuestion: null,
  selectedQuestionError: null,
};

export const getQuestionById = (
  questionId: string,
  dispatch: Dispatch<QuestionActions>
) => {
  // questionClient
  //   .get(`/questions/${questionId}`)
  //   .then((res) =>
  //     dispatch({ type: QuestionActionTypes.VIEW_QUESTION, payload: res.data })
  //   );
  const md =
    "# Sample header 1\n" +
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.<br /><br />" +
    "**Example ordered list:**\n" +
    "1. Item 1\n" +
    "2. `Item 2`\n\n" +
    "*Example unordered list:*\n" +
    "- Item 1\n" +
    "- Item 2";
  dispatch({
    type: QuestionActionTypes.VIEW_QUESTION,
    payload: {
      questionId,
      title: "Test Question",
      description: md,
      complexity: "Easy",
      categories: ["Strings", "Databases"],
    },
  });
};

export const setSelectedQuestionError = (
  error: string,
  dispatch: React.Dispatch<QuestionActions>
) => {
  dispatch({
    type: QuestionActionTypes.ERROR_FETCHING_SELECTED_QN,
    payload: error,
  });
};

const reducer = (
  state: QuestionsState,
  action: QuestionActions
): QuestionsState => {
  const { type } = action;

  switch (type) {
    case QuestionActionTypes.ERROR_FETCHING_SELECTED_QN: {
      const { payload } = action;
      if (typeof payload !== "string") {
        return state;
      }
      return { ...state, selectedQuestionError: payload };
    }
    case QuestionActionTypes.VIEW_QUESTION: {
      const { payload } = action;
      if (!isQuestion(payload)) {
        return state;
      }
      return { ...state, selectedQuestion: payload };
    }
  }
};

export default reducer;
