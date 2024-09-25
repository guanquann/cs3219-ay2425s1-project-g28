import { Dispatch } from "react";
import { questionClient } from "../utils/api";

type QuestionDetail = {
  id: string;
  title: string;
  description: string;
  complexity: string;
  categories: Array<string>;
};

type QuestionList = {
  questions: Array<QuestionDetail>;
  questionCount: number;
};

enum QuestionActionTypes {
  ERROR_FETCHING_SELECTED_QN = "error_fetching_selected_qn",
  VIEW_QUESTION = "view_question",
  VIEW_QUESTION_LIST = "view_question_list",
  DELETE_QUESTION = "delete_question",
}

type QuestionActions = {
  type: QuestionActionTypes;
  payload: QuestionList | QuestionDetail | string;
};

type QuestionsState = {
  questions: Array<QuestionDetail>;
  questionCount: number;
  selectedQuestion: QuestionDetail | null;
  selectedQuestionError: string | null;
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const isQuestion = (question: any): question is QuestionDetail => {
  if (!question || typeof question !== "object") {
    return false;
  }

  return (
    typeof question.id === "string" &&
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

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const isQuestionList = (questionList: any): questionList is QuestionList => {
  if (!questionList || typeof questionList !== "object") {
    return false;
  }

  return (
    Array.isArray(questionList.questions) &&
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    questionList.questions.every((question: any) => isQuestion(question)) &&
    typeof questionList.questionCount === "number"
  );
};

export const initialState: QuestionsState = {
  questions: [],
  questionCount: 0,
  selectedQuestion: null,
  selectedQuestionError: null,
};

export const getQuestionById = (
  questionId: string,
  dispatch: Dispatch<QuestionActions>
) => {
  questionClient
    .get(`/${questionId}`)
    .then((res) => {
      dispatch({
        type: QuestionActionTypes.VIEW_QUESTION,
        payload: res.data.question,
      });
    })
    .catch((err) =>
      dispatch({
        type: QuestionActionTypes.ERROR_FETCHING_SELECTED_QN,
        payload: err.response.data.message,
      })
    );
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

export const getQuestionList = (
  page: number,
  qnLimit: number,
  title: string,
  complexities: string[],
  categories: string[],
  dispatch: Dispatch<QuestionActions>
) => {
  // let queryUrl = `/questions?page=${page}&qnLimit=${qnLimit}&title=${title}`;
  // complexities.map((complexity) => {
  //   queryUrl += `&complexities=${complexity}`
  // });
  // categories.map((category) => {
  //   queryUrl += `&categories=${category}`
  // });
  // questionClient
  //   .get(queryUrl)
  //   .then((res) =>
  //     dispatch({ type: QuestionActionTypes.VIEW_QUESTION_LIST, payload: res.data })
  //   );
  // // OR
  // questionClient
  //   .get("/questions", {params: {
  //     page: page,
  //     qnLimit: qnLimit,
  //     title: title,
  //     complexities: complexities,
  //     categories: categories,
  //   }})
  //   .then((res) =>
  //     dispatch({ type: QuestionActionTypes.VIEW_QUESTION_LIST, payload: res.data })
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
    type: QuestionActionTypes.VIEW_QUESTION_LIST,
    payload: {
      questions: [
        {
          id: "1",
          title: "Test Question 1",
          description: md,
          complexity: "Easy",
          categories: ["Databases", "Strings"],
        },
        {
          id: "2",
          title: "Test Question 2",
          description: md,
          complexity: "Medium",
          categories: ["Arrays", "Bit Manipulation"],
        },
      ],
      questionCount: 2,
    },
  });
};

export const deleteQuestionById = (
  questionId: string,
  dispatch: Dispatch<QuestionActions>
) => {
  // questionClient
  //   .delete(`/questions/${questionId}`)
  //   .then((res) =>
  //     dispatch({ type: QuestionActionTypes.DELETE_QUESTION, payload: res.data })
  //   );
  dispatch({
    type: QuestionActionTypes.DELETE_QUESTION,
    payload: "",
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
    case QuestionActionTypes.VIEW_QUESTION_LIST: {
      const { payload } = action;
      if (!isQuestionList(payload)) {
        return state;
      }
      return {
        ...state,
        questions: payload.questions,
        questionCount: payload.questionCount,
      };
    }
    case QuestionActionTypes.DELETE_QUESTION: {
      // TODO
      // const { payload } = action;
      return state;
    }
  }
};

export default reducer;
