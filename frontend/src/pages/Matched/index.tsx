import AppMargin from "../../components/AppMargin";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import classes from "./index.module.css";
import { useMatch } from "../../contexts/MatchContext";
import { USE_MATCH_ERROR_MESSAGE } from "../../utils/constants";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import Loader from "../../components/Loader";

const acceptanceTimeout = 10;

const Matched: React.FC = () => {
  const match = useMatch();
  if (!match) {
    throw new Error(USE_MATCH_ERROR_MESSAGE);
  }
  const { acceptMatch, rematch, stopMatch, matchUser, partner, loading } =
    match;

  const [timeLeft, setTimeLeft] = useState<number>(acceptanceTimeout);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime <= 0 ? 0 : prevTime - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("Match acceptance timeout!");
      stopMatch("/home");
    }
  }, [timeLeft]);

  if (!matchUser || !partner) {
    return <Navigate to="/home" />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <AppMargin classname={`${classes.fullheight} ${classes.center}`}>
      <Stack spacing={2} alignItems={"center"}>
        <Typography variant="h1">It's a match!</Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          paddingTop={2}
          paddingBottom={2}
        >
          <Avatar src={matchUser.profile} sx={{ width: 120, height: 120 }} />

          <Box
            sx={(theme) => ({
              width: "120px",
              height: "2px",
              backgroundColor: theme.palette.secondary.contrastText,
              margin: "0 10px",
            })}
          />

          <Avatar src={partner.profile} sx={{ width: 120, height: 120 }} />
        </Box>

        <Typography variant="h3">Practice with @{partner.username}?</Typography>

        <Stack spacing={2} direction="row" paddingTop={2} width={700}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={rematch}
          >
            Rematch
          </Button>
          <Button variant="contained" fullWidth onClick={acceptMatch}>
            Accept
          </Button>
        </Stack>
      </Stack>
    </AppMargin>
  );
};

export default Matched;
