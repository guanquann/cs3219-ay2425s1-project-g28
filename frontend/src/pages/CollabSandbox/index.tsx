import AppMargin from "../../components/AppMargin";
import { Button, Stack, Typography } from "@mui/material";
import classes from "./index.module.css";
import { useMatch } from "../../contexts/MatchContext";
import { USE_MATCH_ERROR_MESSAGE } from "../../utils/constants";

// TODO: Prevent user from accessing this page via URL
const CollabSandbox: React.FC = () => {
  const match = useMatch();
  if (!match) {
    throw new Error(USE_MATCH_ERROR_MESSAGE);
  }
  const { closeConnection } = match;

  return (
    <AppMargin classname={`${classes.fullheight} ${classes.center}`}>
      <Stack spacing={2} alignItems={"center"}>
        <Typography variant="h1">Collaborative Sandbox</Typography>
        <Typography variant="h3">Coming soon...</Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => closeConnection("/home")}
        >
          End Session
        </Button>
      </Stack>
    </AppMargin>
  );
};

export default CollabSandbox;
