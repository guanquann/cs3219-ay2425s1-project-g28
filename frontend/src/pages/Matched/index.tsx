import { useNavigate } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import classes from "./index.module.css";

const Matched: React.FC = () => {
  const navigate = useNavigate();

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
          <Avatar sx={{ width: 120, height: 120 }} />

          <Box
            sx={(theme) => ({
              width: "120px",
              height: "2px",
              backgroundColor: theme.palette.secondary.contrastText,
              margin: "0 10px",
            })}
          />

          <Avatar sx={{ width: 120, height: 120 }} />
        </Box>

        <Typography variant="h3">Practice with @john?</Typography>

        <Stack spacing={2} direction="row" paddingTop={2} width={700}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => navigate("/matching")}
          >
            Rematch
          </Button>
          <Button variant="contained" fullWidth>
            Accept
          </Button>
        </Stack>
      </Stack>
    </AppMargin>
  );
};

export default Matched;
