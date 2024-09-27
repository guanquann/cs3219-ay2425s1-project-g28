import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import LogInSvg from "../../assets/login.svg?react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LogIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const auth = useAuth();
  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }
  const { login } = auth;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        minWidth: "755px",
      }}
    >
      <Box flex={1}>
        <Stack
          height="100%"
          direction="column"
          sx={(theme) => ({ 
            backgroundColor: "secondary.main",
            padding: theme.spacing(2, 10),
            justifyContent: "center",
          })}
        >
          <Typography 
            component="h1" 
            variant="h1"
            sx={{ color: "primary.main", textAlign: "center" }}
          >
            PeerPrep
          </Typography>
          <Stack 
            direction="column" 
            spacing={1.5}
            sx={(theme) => ({
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
            })}
          >
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              onChange={(input) => setEmail(input.target.value)}
              slotProps={{

              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              size="small"
              onChange={(input) => setPassword(input.target.value)}
              slotProps={{

              }}
            />
          </Stack>
          <Button
            variant="contained"
            sx={(theme) => ({
              marginTop: theme.spacing(1),
              marginBottom: theme.spacing(1),
              height: theme.spacing(5),
            })}
            onClick={() => login(email, password)}
          >
            Log in
          </Button>
          <Stack 
            direction="row" 
            spacing={0.5}
            sx={{ justifyContent: "flex-end" }}
          >
            <Typography 
              component="span"
              sx={{ fontSize: 14 }}
            >
              Don't have an account?
            </Typography>
            <Typography 
              component="span"
              sx={{
                fontSize: 14,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box
        flex={1} 
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LogInSvg width="80%" height="80%" />
      </Box>
    </Box>
  );
};

export default LogIn;
