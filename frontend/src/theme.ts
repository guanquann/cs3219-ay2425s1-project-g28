import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#8FB8ED", contrastText: "#FFFFFF" },
    secondary: { main: "#ECECEC", contrastText: "#757575" },
    error: { main: "#D33737" },
    success: { main: "#35B25D" },
    common: { white: "#FFFFFF", black: "#2F2F2F" },
  },
  typography: {
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
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
