import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import AppMargin from "../AppMargin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { USE_AUTH_ERROR_MESSAGE } from "../../utils/constants";

type NavbarItem = { label: string; link: string };

type NavbarProps = { navbarItems?: Array<NavbarItem> };

const Navbar: React.FC<NavbarProps> = (props) => {
  const { navbarItems = [{ label: "Questions", link: "/questions" }] } = props;
  const navigate = useNavigate();
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!auth) {
    throw new Error(USE_AUTH_ERROR_MESSAGE);
  }

  const { logout, user } = auth;

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

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
        <Toolbar sx={{ padding: 0 }}>
          <Typography
            component={Box}
            variant="h5"
            sx={[{ flexGrow: 1, "&:hover": { cursor: "pointer" } }]}
            onClick={() => navigate("/")}
          >
            PeerPrep
          </Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
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
            {user ? (
              <>
                <Tooltip title={"Account settings"}>
                  <IconButton onClick={handleClick} data-testid="profile">
                    <Avatar src={user.profilePictureUrl}/>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={!!anchorEl}
                  onClose={handleClose}
                  onClick={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate(`/profile/${user.id}`);
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button variant="contained" onClick={() => navigate("/signup")}>
                  Sign up
                </Button>
                <Button variant="outlined" onClick={() => navigate("/login")}>
                  Log in
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppMargin>
    </AppBar>
  );
};

export default Navbar;
