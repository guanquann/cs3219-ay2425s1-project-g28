import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import LogInSvg from "../../assets/login.svg?react";
import { useAuth } from "../../contexts/AuthContext";
import { emailValidator } from "../../utils/validators";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { USE_AUTH_ERROR_MESSAGE } from "../../utils/constants";

const ForgetPassword: React.FC = () => {
  const auth = useAuth();
  if (!auth) {
    throw new Error(USE_AUTH_ERROR_MESSAGE);
  }
  const { resetPassword } = auth;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({ mode: "all" });

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
            Reset Password
          </Typography>
          <Stack
            component="form"
            direction="column"
            spacing={1.5}
            sx={(theme) => ({
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
            })}
            onSubmit={handleSubmit((data) => resetPassword(data.email))}
            noValidate
          >
            <Typography>
              Enter your email address and we will send you a password reset
              link.
            </Typography>
            <TextField
              label="Email"
              required
              fullWidth
              margin="normal"
              type="email"
              {...register("email", {
                setValueAs: (value: string) => value.trim(),
                validate: { emailValidator },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Button
              type="submit"
              variant="contained"
              sx={(theme) => ({ margin: theme.spacing(2, 0) })}
            >
              Send Reset Link
            </Button>
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

export default ForgetPassword;
