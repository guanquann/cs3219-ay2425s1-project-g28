import { Box, Button, Stack, Typography } from "@mui/material";
import SignUpSvg from "../../assets/signup.svg?react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CustomTextField from "../../components/CustomTextField";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  usernameValidator,
} from "../../utils/validators";
import { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }
  const { signup } = auth;

  const formValues = useRef({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const formValidity = useRef({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
  });
  const [emptyFields, setEmptyFields] = useState<{ [key: string]: boolean }>({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
  });

  const handleInputChange = (
    field: keyof typeof formValues.current,
    value: string,
    isValid: boolean,
  ) => {
    formValues.current[field] = value;
    formValidity.current[field] = isValid;
    setEmptyFields((prevState) => ({ ...prevState, [field]: !value }));
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!Object.values(formValidity.current).every((isValid) => isValid)) {
      // Mark untouched required fields red
      Object.entries(formValues.current).forEach(([field, value]) => {
        setEmptyFields((prevState) => ({ ...prevState, [field]: !value }));
      });
      return;
    }

    const { firstName, lastName, username, email, password } =
      formValues.current;
    signup(firstName, lastName, username, email, password);
  };

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
            spacing={1.5}
            sx={(theme) => ({
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
            })}
            onSubmit={handleSignUp}
            noValidate
          >
            <CustomTextField
              label="First Name"
              size="small"
              required
              emptyField={emptyFields.firstName}
              validator={nameValidator}
              onChange={(value, isValid) =>
                handleInputChange("firstName", value, isValid)
              }
            />
            <CustomTextField
              label="Last Name"
              size="small"
              required
              emptyField={emptyFields.lastName}
              validator={nameValidator}
              onChange={(value, isValid) =>
                handleInputChange("lastName", value, isValid)
              }
            />
            <CustomTextField
              label="Username"
              size="small"
              required
              emptyField={emptyFields.username}
              validator={usernameValidator}
              onChange={(value, isValid) =>
                handleInputChange("username", value, isValid)
              }
            />
            <CustomTextField
              label="Email"
              size="small"
              required
              emptyField={emptyFields.email}
              validator={emailValidator}
              onChange={(value, isValid) =>
                handleInputChange("email", value, isValid)
              }
            />
            <CustomTextField
              label="Password"
              size="small"
              required
              emptyField={emptyFields.password}
              validator={passwordValidator}
              onChange={(value, isValid) =>
                handleInputChange("password", value, isValid)
              }
              isPasswordField
            />
            <Button
              type="submit"
              variant="contained"
              sx={(theme) => ({ height: theme.spacing(5) })}
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
