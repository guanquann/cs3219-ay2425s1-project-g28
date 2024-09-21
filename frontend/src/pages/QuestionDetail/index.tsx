import {
  Box,
  Chip,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import AppMargin from "../../components/AppMargin";
import { grey } from "@mui/material/colors";
import classes from "./index.module.css";
import NotFound from "../../components/NotFound";

type Question = {
  title: string;
  description: string;
  complexity: string;
  categories: Array<string>;
};

const QuestionDetail: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (!questionId) {
      setIsLoading(false);
      return;
    }

    // TODO: fetch question
    const md =
      "# Sample header 1\n" +
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.<br /><br />" +
      "**Example ordered list:**\n" +
      "1. Item 1\n" +
      "2. `Item 2`\n\n" +
      "*Example unordered list:*\n" +
      "- Item 1\n" +
      "- Item 2";
    setQuestion({
      title: "Test Question",
      description: md,
      complexity: "Medium",
      categories: ["Category 1", "Category 2"],
    });
    setIsLoading(false);
  }, []);

  if (!question) {
    if (isLoading) {
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
            {question.title}
          </Typography>
          <Stack
            direction={"row"}
            sx={(theme) => ({ marginTop: theme.spacing(2) })}
          >
            <Chip
              key={question.complexity}
              label={question.complexity}
              color="primary"
              sx={(theme) => ({
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              })}
            />
            {question.categories.map((cat) => (
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
          {question.description}
        </Markdown>
      </Box>
    </AppMargin>
  );
};

export default QuestionDetail;
