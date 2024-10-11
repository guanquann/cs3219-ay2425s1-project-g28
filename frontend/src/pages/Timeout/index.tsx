import { useNavigate } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import { Button, Stack, Typography } from "@mui/material";
import timeout from "../../assets/timeout.svg";
import classes from "./index.module.css";

const Timeout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppMargin classname={`${classes.fullheight} ${classes.center}`}>
      <Stack spacing={2} alignItems={"center"}>
        <Typography variant="h1">Oops, timeout...</Typography>

        <img src={timeout} style={{ height: 240, width: "auto" }} />

        <Typography variant="h3">
          Unfortunately, we could not find a match.
        </Typography>

        <Stack spacing={2} direction="row" paddingTop={2} width={700}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => navigate("/questions")}
          >
            Exit
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/matching")}
          >
            Try Again
          </Button>
        </Stack>
      </Stack>
    </AppMargin>
  );
};

export default Timeout;
