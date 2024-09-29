import { forwardRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PasswordTextField from "../PasswordTextField";
import { userClient } from "../../utils/api";
import axios from "axios";
import {
  FAILED_PW_UPDATE_MESSAGE,
  SUCCESS_PW_UPDATE_MESSAGE,
} from "../../utils/constants";

interface ChangePasswordModalProps {
  handleClose: () => void;
  userId: string;
  onUpdate: (
    isProfileEdit: boolean,
    message: string,
    isSuccess: boolean,
  ) => void;
}

const ChangePasswordModal = forwardRef<
  HTMLDivElement,
  ChangePasswordModalProps
>((props, ref) => {
  const { handleClose, userId, onUpdate } = props;
  const [currPassword, setCurrPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isCurrPasswordValid, setIsCurrPasswordValid] =
    useState<boolean>(false);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState<boolean>(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    useState<boolean>(false);

  const isUpdateDisabled = !(
    isCurrPasswordValid &&
    isNewPasswordValid &&
    isConfirmPasswordValid
  );

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("token");

    try {
      await userClient.patch(
        `/users/${userId}`,
        {
          oldPassword: currPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      handleClose();
      onUpdate(false, SUCCESS_PW_UPDATE_MESSAGE, true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message || FAILED_PW_UPDATE_MESSAGE;
        onUpdate(false, message, false);
      } else {
        onUpdate(false, FAILED_PW_UPDATE_MESSAGE, false);
      }
    }
  };

  return (
    <Box
      ref={ref}
      sx={(theme) => ({
        backgroundColor: theme.palette.common.white,
        display: "flex",
        width: 600,
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "16px",
        padding: "40px",
      })}
    >
      <Typography component="h1" variant="h3">
        Change Password
      </Typography>
      <PasswordTextField
        label="Current password"
        passwordVal={false}
        password={currPassword}
        setPassword={setCurrPassword}
        isMatch={false}
        setValidity={setIsCurrPasswordValid}
      />
      <PasswordTextField
        label="New password"
        passwordVal={true}
        password={newPassword}
        setPassword={setNewPassword}
        isMatch={true}
        passwordToMatch={confirmPassword}
        setValidity={setIsNewPasswordValid}
      />
      <PasswordTextField
        label="Confirm new password"
        passwordVal={false}
        password={confirmPassword}
        setPassword={setConfirmPassword}
        isMatch={true}
        passwordToMatch={newPassword}
        setValidity={setIsConfirmPasswordValid}
      />
      <Stack direction="row" spacing={2} sx={{ marginTop: 2, width: "100%" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClose}
          sx={{ flexGrow: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isUpdateDisabled}
          onClick={handleSubmit}
          sx={{ flexGrow: 1 }}
        >
          Update
        </Button>
      </Stack>
    </Box>
  );
});

export default ChangePasswordModal;
