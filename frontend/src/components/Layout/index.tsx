import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const Layout: React.FC = () => {
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
