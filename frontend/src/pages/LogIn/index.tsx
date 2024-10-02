import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LogInSvg from "../../assets/login.svg?react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { emailValidator, passwordValidator } from "../../utils/validators";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordTextField from "../../components/PasswordTextField";

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }
  const { login } = auth;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ mode: "all" });

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
            component="form"
            direction="column"
            sx={(theme) => ({
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
            })}
            onSubmit={handleSubmit((data) => login(data.email, data.password))}
            noValidate
          >
            <TextField
              label="Email"
              required
              fullWidth
              margin="normal"
              type="email"
              {...register("email", { validate: { emailValidator } })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <PasswordTextField
              label="Password"
              required
              fullWidth
              margin="normal"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              sx={(theme) => ({ margin: theme.spacing(2, 0) })}
            >
              Log in
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ justifyContent: "flex-end" }}
          >
            <Typography component="span" sx={{ fontSize: 14 }}>
              Don't have an account?
            </Typography>
            <Typography
              component="span"
              role="button"
              tabIndex={0}
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
      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default LogIn;
