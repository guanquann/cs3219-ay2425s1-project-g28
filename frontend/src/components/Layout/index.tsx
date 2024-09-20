import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const Layout: FunctionComponent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        // minInlineSize: "100vw",
      }}
    >
      <Navbar />
      <Outlet />
    </Box>
  );
};

export default Layout;
