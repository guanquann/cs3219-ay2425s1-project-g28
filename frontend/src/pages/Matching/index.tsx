import React, { useEffect, useState } from "react";
import AppMargin from "../../components/AppMargin";
import { Stack, Typography } from "@mui/material";
import matching from "../../assets/matching.svg";
import classes from "./index.module.css";
import Timer from "../../components/Timer";
import { useMatch } from "../../contexts/MatchContext";
import { USE_MATCH_ERROR_MESSAGE } from "../../utils/constants";

const Matching: React.FC = () => {
  const match = useMatch();
  if (!match) {
    throw new Error(USE_MATCH_ERROR_MESSAGE);
  }
  const { stopMatch, matchCriteria } = match;

  const [timeLeft, setTimeLeft] = useState<number>(matchCriteria.timeout);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime <= 0 ? 0 : prevTime - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      stopMatch("/matching/timeout");
    }
  }, [timeLeft]);

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
