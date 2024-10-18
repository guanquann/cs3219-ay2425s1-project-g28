import { useNavigate, useParams } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { userClient } from "../../utils/api";
import classes from "./index.module.css";
import { toast } from "react-toastify";

const EmailVerification: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    userClient
      .get(`/users/${userId}/`)
      .then((res) => {
        setEmail(res.data.data.email);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleResend = () => {
    userClient
      .post(`/users/send-verification-email`, { email })
      .catch((err) => console.error(err));
  };

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    userClient
      .get(`/users/verify-email/${email}/${token}`)
      .then((res) => {
        navigate("/auth/login");
        toast.success(res.data.message);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppMargin classname={`${classes.fullheight}`}>
        <Box
          sx={(theme) => ({
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.spacing(1),
            width: "40vw",
            padding: theme.spacing(4),
          })}
        >
          <Typography variant="h5">Verify your email address</Typography>
          <Typography sx={(theme) => ({ margin: theme.spacing(2, 0) })}>
            An account verification token has been sent to your email.
          </Typography>
          <form onSubmit={handleVerify}>
            <TextField
              fullWidth
              margin="normal"
              label="Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <Stack
              direction="row"
              spacing={2}
              sx={(theme) => ({ marginTop: theme.spacing(4) })}
            >
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleResend}
              >
                Resend
              </Button>
              <Button fullWidth variant="contained" type="submit">
                Verify
              </Button>
            </Stack>
          </form>
        </Box>
      </AppMargin>
    </Box>
  );
};

export default EmailVerification;
