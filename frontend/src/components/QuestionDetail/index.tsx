import { Box, Chip, List, ListItem, Stack, Typography, useTheme } from "@mui/material";
import Markdown from "markdown-to-jsx";
import { grey } from "@mui/material/colors";

interface QuestionDetailProps {
  title: string;
  complexity: string | null;
  categories: string[];
  description: string;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({
  title,
  complexity,
  categories,
  description,
}) => {
  const theme = useTheme();

  return (
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
          {title}
        </Typography>
        <Stack direction={"row"} sx={(theme) => ({ marginTop: theme.spacing(2) })}>
          {complexity && (
            <Chip
              key={complexity}
              label={complexity}
              color="primary"
              sx={(theme) => ({
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              })}
            />
          )}
          {categories.map((cat) => (
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
            img: {
              component: "img",
              props: {
                style: { height: "300px", width: "auto", objectFit: "contain" },
              },
            },
          },
        }}
      >
        {description}
      </Markdown>
    </Box>
  );
};

export default QuestionDetail;
