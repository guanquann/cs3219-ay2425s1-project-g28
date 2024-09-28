import { Box, Button, Stack, Typography } from "@mui/material";
import LogInSvg from "../../assets/login.svg?react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CustomTextField from "../../components/CustomTextField";
import { emailValidator } from "../../utils/validators";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }
  const { login } = auth;

  const formValues = useRef({ email: "", password: "" });
  const formValidity = useRef({ email: false, password: false });
  const [emptyFields, setEmptyFields] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
  });

  const handleInputChange = (field: keyof typeof formValues.current, value: string, isValid: boolean) => {
    formValues.current[field] = value;
    formValidity.current[field] = isValid;
    setEmptyFields((prevState) => ({ ...prevState, [field]: !value }));
  };

  const handleLogIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!Object.values(formValidity.current).every((isValid) => isValid)) {
      // Mark untouched required fields red
      Object.entries(formValues.current).forEach(([field, value]) => {
        setEmptyFields((prevState) => ({ ...prevState, [field]: !value }));
      });
      return;
    }

    const { email, password } = formValues.current;
    login(email, password);
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
            onSubmit={handleLogIn}
            noValidate
          >
            <CustomTextField
              label="Email"
              size="small"
              required
              emptyField={emptyFields.email}
              validator={emailValidator}
              onChange={(value, isValid) => handleInputChange("email", value, isValid)}
            />
            <CustomTextField
              label="Password"
              size="small"
              required
              emptyField={emptyFields.password}
              onChange={(value, isValid) => handleInputChange("password", value, isValid)}
              isPasswordField
            />
            <Button
              type="submit"
              variant="contained"
              sx={(theme) => ({ height: theme.spacing(5) })}
            >
              Log in
            </Button>
          </Stack>
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
      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default LogIn;
