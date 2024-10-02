import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from "@mui/material";

type TimerProps = { totalTime: number; timeLeft: number };

const Timer: React.FC<CircularProgressProps & TimerProps> = (props) => {
  const { totalTime, timeLeft } = props;
  const percentage = (timeLeft / totalTime) * 100;
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        size={80}
        value={100}
        sx={(theme) => ({ color: theme.palette.grey[200] })}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        value={percentage}
        size={80}
        sx={{ position: "absolute" }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{timeLeft}</Typography>
      </Box>
    </Box>
  );
};

export default Timer;
