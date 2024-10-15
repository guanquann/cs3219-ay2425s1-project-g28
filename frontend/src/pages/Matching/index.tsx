import React, { useEffect, useState } from "react";
import AppMargin from "../../components/AppMargin";
import { Stack, Typography } from "@mui/material";
import matching from "../../assets/matching.svg";
import classes from "./index.module.css";
import Timer from "../../components/Timer";
import { useNavigate } from "react-router-dom";
import { useMatch } from "../../contexts/MatchContext";
import { USE_MATCH_ERROR_MESSAGE } from "../../utils/constants";

// TODO: Prevent user from accessing this page via URL
const Matching: React.FC = () => {
  const navigate = useNavigate();

  const match = useMatch();
  if (!match) {
    throw new Error(USE_MATCH_ERROR_MESSAGE);
  }
  const { closeConnection, matchId, matchCriteria } = match;

  const [timeLeft, setTimeLeft] = useState<number>(matchCriteria.timeout);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime <= 0 ? 0 : prevTime - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      closeConnection("timeout");
    }
  }, [timeLeft]);

  useEffect(() => {
    if (matchId) {
      navigate("matched", { replace: true });
    }
  }, [matchId, navigate]);

  return (
    <AppMargin classname={`${classes.fullheight} ${classes.center}`}>
      <Stack spacing={2} alignItems={"center"}>
        <Typography component={"h1"} variant="h3">
          Finding your practice partner
        </Typography>
        <img src={matching} style={{ height: 120, width: "auto" }} />
        <Timer
          totalTime={matchCriteria.timeout}
          timeLeft={timeLeft}
          thickness={4.8}
          size={120}
        />
      </Stack>
    </AppMargin>
  );
};

export default Matching;
