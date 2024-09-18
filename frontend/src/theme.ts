import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8FB8ED",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#ECECEC",
      contrastText: "#757575",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
  },
});

export default theme;
