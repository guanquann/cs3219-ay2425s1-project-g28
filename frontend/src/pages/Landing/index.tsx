import { Typography } from "@mui/material";

import classes from "./index.module.css";
import AppMargin from "../../components/AppMargin";

const Landing: React.FC = () => {
  return (
    <AppMargin
      classname={`${classes.fullheight} ${classes.center} ${classes.margins}`}
    >
      <Typography
        component={"h1"}
        variant="h1"
        textAlign={"center"}
        sx={(theme) => ({
          fontWeight: "bold",
          color: "primary.main",
          marginBottom: theme.spacing(4),
        })}
      >
        Level up in your technical interviews!
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign={"center"}
        sx={(theme) => ({
          fontSize: "h5.fontSize",
          marginBottom: theme.spacing(4),
          maxWidth: "80%",
        })}
      >
        Your ultimate technical interview preparation platform to practice
        whiteboard style interview questions with a peer.
      </Typography>
    </AppMargin>
  );
};

export default Landing;
