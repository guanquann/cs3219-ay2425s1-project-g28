import { Box, Typography } from "@mui/material";

type NotFoundProps = { title: string; subtitle: string };

const NotFound: React.FC<NotFoundProps> = (props) => {
  const { title, subtitle } = props;
  return (
    <Box>
      <Typography
        component={"h1"}
        variant="h3"
        textAlign={"center"}
        sx={(theme) => ({ marginBottom: theme.spacing(4) })}
      >
        {title}
      </Typography>
      <Typography textAlign={"center"}>{subtitle}</Typography>
    </Box>
  );
};

export default NotFound;
