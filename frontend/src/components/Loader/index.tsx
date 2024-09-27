import { Box, Typography } from "@mui/material";
import { Oval } from "react-loader-spinner";

const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: "755px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Oval
        height="80"
        width="80"
        color="#8FB8ED"
        secondaryColor="#9E9E9E"
      />
      <Typography
        variant="h4"
        sx={(theme) => ({ marginTop: theme.spacing(2) })}
      >Loading...</Typography>
    </Box>
  );
};

export default Loader;
