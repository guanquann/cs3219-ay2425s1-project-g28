import { AppBar, Box, Link, Toolbar, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import AppMargin from "../AppMargin";
import { useNavigate } from "react-router-dom";

type NavbarItem = { label: string; link: string };

type NavbarProps = { navbarItems?: Array<NavbarItem> };

const Navbar: React.FC<NavbarProps> = (props) => {
  const { navbarItems = [{ label: "Questions", link: "/questions" }] } = props;
  const navigate = useNavigate();

  return (
    <AppBar
      component={"nav"}
      position="sticky"
      sx={{
        backgroundColor: "common.white",
        color: "primary.main",
        boxShadow: "none",
        borderBottom: "1px solid",
        borderColor: grey[300],
      }}
    >
      <AppMargin>
        <Toolbar>
          <Typography
            component={Box}
            variant="h5"
            sx={[{ flexGrow: 1, "&:hover": { cursor: "pointer" } }]}
            onClick={() => navigate("/")}
          >
            PeerPrep
          </Typography>
          <Box>
            {navbarItems.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                underline="none"
                sx={{ color: "common.black" }}
              >
                {item.label}
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppMargin>
    </AppBar>
  );
};

export default Navbar;
