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
import { FunctionComponent, useState } from "react";
import AppMargin from "../AppMargin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type NavbarItem = { label: string; link: string };

type NavbarProps = { navbarItems?: Array<NavbarItem> };

const Navbar: FunctionComponent<NavbarProps> = (props: NavbarProps) => {
  const { navbarItems = [{ label: "Questions", link: "/questions" }] } = props;
  const navigate = useNavigate();
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }

  const { user } = auth;

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
                  <IconButton onClick={handleClick}>
                    <Avatar />
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
                      navigate(`/profile/${user?.username}}`);
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button variant="contained">Sign up</Button>
                <Button variant="outlined">Log in</Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppMargin>
    </AppBar>
  );
};

export default Navbar;
