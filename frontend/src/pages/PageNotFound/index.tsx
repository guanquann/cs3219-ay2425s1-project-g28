import AppMargin from "../../components/AppMargin";
import { Box, Typography } from "@mui/material";
import classes from "./index.module.css";

const PageNotFound: React.FC = () => {
  return (
    <AppMargin classname={`${classes.fullheight} ${classes.center}`}>
      <Box>
        <Typography
          component={"h1"}
          variant="h3"
          textAlign={"center"}
          sx={(theme) => ({ marginBottom: theme.spacing(4) })}
        >
          Oops, page not found...
        </Typography>
        <Typography textAlign={"center"}>
          Unfortunately, we can't find what you're looking for 😥
        </Typography>
      </Box>
    </AppMargin>
  );
};

export default PageNotFound;
