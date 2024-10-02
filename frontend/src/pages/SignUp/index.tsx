import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SignUpSvg from "../../assets/signup.svg?react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  usernameValidator,
} from "../../utils/validators";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }
  const { signup } = auth;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }>({ mode: "all" });

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
            onSubmit={handleSubmit((data) =>
              signup(
                data.firstName,
                data.lastName,
                data.username,
                data.email,
                data.password
              )
            )}
          >
            <TextField
              label="First name"
              required
              fullWidth
              margin="normal"
              {...register("firstName", { validate: { nameValidator } })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              label="Last name"
              required
              fullWidth
              margin="normal"
              {...register("lastName", { validate: { nameValidator } })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              label="Username"
              required
              fullWidth
              margin="normal"
              {...register("username", { validate: { usernameValidator } })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
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
            <TextField
              label="Password"
              required
              fullWidth
              margin="normal"
              type="password"
              {...register("password", { validate: { passwordValidator } })}
              error={!!errors.password}
              helperText={errors.password?.message}
              typeof={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff
                            sx={(theme) => ({ fontSize: theme.spacing(2.5) })}
                          />
                        ) : (
                          <Visibility
                            sx={(theme) => ({ fontSize: theme.spacing(2.5) })}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={(theme) => ({ margin: theme.spacing(2, 0) })}
            >
              Sign up
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ justifyContent: "flex-end" }}
          >
            <Typography component="span" sx={{ fontSize: 14 }}>
              Have an account?
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
              onClick={() => navigate("/login")}
            >
              Log in
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
        <SignUpSvg width="80%" height="80%" />
      </Box>
      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default SignUp;
