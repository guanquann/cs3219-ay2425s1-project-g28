import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import classes from "./index.module.css";
import NotFound from "../../components/NotFound";
import QuestionDetailComponent from "../../components/QuestionDetail";
import reducer, {
  getQuestionById,
  initialState,
  setSelectedQuestionError,
} from "../../reducers/questionReducer";

const QuestionDetail: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!questionId) {
      setSelectedQuestionError("Unable to fetch question.", dispatch);
      return;
    }

    getQuestionById(questionId, dispatch);
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  if (!state.selectedQuestion) {
    if (state.selectedQuestionError) {
      return (
        <AppMargin classname={`${classes.fullheight} ${classes.center}`}>
          <NotFound
            title="Question not found..."
            subtitle="Unfortunately, we can't find what you're looking for 😥"
          />
        </AppMargin>
      );
    } else {
      return;
    }
  }

  return (
    <AppMargin>
      <QuestionDetailComponent
        title={state.selectedQuestion.title}
        complexity={state.selectedQuestion.complexity}
        categories={state.selectedQuestion.categories}
        description={state.selectedQuestion.description}
      />
    </AppMargin>
  );
};

export default QuestionDetail;
