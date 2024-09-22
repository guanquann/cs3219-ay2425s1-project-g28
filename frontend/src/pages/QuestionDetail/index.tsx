import {
  Box,
  Chip,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import AppMargin from "../../components/AppMargin";
import { grey } from "@mui/material/colors";
import classes from "./index.module.css";
import NotFound from "../../components/NotFound";
import reducer, {
  getQuestionById,
  initialState,
  setSelectedQuestionError,
} from "../../reducers/questionReducer";

const QuestionDetail: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();

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
      <Box
        sx={(theme) => ({
          marginTop: theme.spacing(4),
          marginBottom: theme.spacing(4),
        })}
      >
        <Box
          sx={(theme) => ({
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
          })}
        >
          <Typography component={"h1"} variant="h3">
            {state.selectedQuestion.title}
          </Typography>
          <Stack
            direction={"row"}
            sx={(theme) => ({ marginTop: theme.spacing(2) })}
          >
            <Chip
              key={state.selectedQuestion.complexity}
              label={state.selectedQuestion.complexity}
              color="primary"
              sx={(theme) => ({
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              })}
            />
            {state.selectedQuestion.categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                sx={(theme) => ({
                  marginLeft: theme.spacing(1),
                  marginRight: theme.spacing(1),
                })}
              />
            ))}
          </Stack>
        </Box>
        <Markdown
          options={{
            overrides: {
              h1: {
                component: Typography,
                props: { component: "h1", variant: "h4" },
              },
              h2: {
                component: Typography,
                props: { component: "h2", variant: "h5" },
              },
              h3: {
                component: Typography,
                props: { component: "h3", variant: "h6" },
              },
              p: {
                component: Typography,
              },
              ol: {
                component: List,
                props: {
                  component: "ol",
                  sx: {
                    paddingLeft: theme.spacing(4),
                    listStyleType: "decimal",
                  },
                },
              },
              ul: {
                component: List,
                props: {
                  component: "ul",
                  sx: {
                    paddingLeft: theme.spacing(4),
                    listStyleType: "disc",
                  },
                },
              },
              li: {
                component: ListItem,
                props: { sx: { display: "list-item" } },
              },
              code: {
                props: {
                  style: {
                    backgroundColor: grey[200],
                    padding: "0.2em",
                    borderRadius: "0.4em",
                  },
                },
              },
            },
          }}
        >
          {state.selectedQuestion.description}
        </Markdown>
      </Box>
    </AppMargin>
  );
};

export default QuestionDetail;
